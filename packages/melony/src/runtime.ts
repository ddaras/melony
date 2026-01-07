import {
  Action,
  Event,
  NextAction,
  RuntimeContext,
  Config,
  Plugin,
  ui,
  HookGenerator,
} from "./types";
import { generateId } from "./utils/generate-id";
import { z } from "zod";

/**
 * Helper to check if a value is a Melony Event.
 */
function isEvent(val: any): val is Event {
  return val && typeof val === "object" && typeof val.type === "string";
}

/**
 * The Slim Runtime.
 * Single Responsibility: Orchestrate Event -> Action -> Event transitions.
 */
export class Runtime<TState = any> {
  private config: Config<TState>;

  constructor(config: Config<TState>) {
    this.config = config;
  }

  public async *run(event: Event): AsyncGenerator<Event> {
    const runId = event.runId ?? generateId();

    const context: RuntimeContext<TState> = {
      state: (event.state ?? {}) as TState,
      runId,
      stepCount: 0,
      actions: this.config.actions,
      ui,
      suspend: (event?: Event) => {
        throw event || { type: "run-suspended" };
      },
    };

    try {
      let nextAction: NextAction | void = undefined;

      // 1. Trigger Plugins: onBeforeRun
      for (const plugin of this.config.plugins || []) {
        if (plugin.onBeforeRun) {
          const result = yield* this.callHook(
            plugin.onBeforeRun({ event }, context),
            context
          );
          if (result) {
            nextAction = result as NextAction;
          }
        }
      }

      // 2. Trigger Hook: onBeforeRun
      if (this.config.hooks?.onBeforeRun) {
        const result = yield* this.callHook(
          this.config.hooks.onBeforeRun({ event }, context),
          context
        );
        if (result) {
          nextAction = result as NextAction;
        }
      }

      yield* this.emit(
        { type: "run-started", data: { inputEvent: event } },
        context
      );

      // Initial dispatch of the incoming event to the agent's brain
      // Priority:
      // 1. nextAction already set by onBeforeRun hooks
      // 2. nextAction provided in the event itself
      // 3. Dispatch to brain to decide nextAction
      if (!nextAction && event.nextAction) {
        nextAction = event.nextAction;
      }

      if (!nextAction && this.config.brain) {
        nextAction = yield* this.dispatchToBrain(event, context);
      }

      // Agentic loop
      while (nextAction) {
        if (context.stepCount++ >= (this.config.safetyMaxSteps ?? 10)) {
          yield* this.emit(
            { type: "error", data: { message: "Max steps exceeded" } },
            context
          );
          break;
        }

        const current: NextAction = nextAction;
        nextAction = undefined; // Reset

        // 1. Resolve Action
        const actionName: string | undefined = current.action;

        if (!actionName) {
          yield* this.emit(
            {
              type: "error",
              data: { message: "No action name provided in NextAction" },
            },
            context
          );
          break;
        }

        const action: Action<any, TState> = this.config.actions[actionName];

        if (!action) {
          yield* this.emit(
            {
              type: "error",
              data: { message: `Action ${actionName} not found` },
            },
            context
          );
          break;
        }

        // 2. Execute Action
        const result = yield* this.executeAction(action, current, context);

        // 3. Decide Next Step
        if (this.config.brain) {
          // If we have a brain, feed the result back to it to decide what to do next.
          // This keeps the brain in the loop for multi-step reasoning.
          nextAction = yield* this.dispatchToBrain(
            {
              type: "action-result",
              data: {
                ...current, // Preserve all metadata (like toolCallId)
                action: actionName,
                result,
              },
            },
            context
          );
        } else {
          // Simple mode: follow the action's own suggestion for the next step.
          nextAction = result;
        }
      }

      // 1. Trigger Plugins: onAfterRun
      for (const plugin of this.config.plugins || []) {
        if (plugin.onAfterRun) {
          yield* this.callHook(plugin.onAfterRun(context), context);
        }
      }

      // 2. Trigger Hook: onAfterRun
      if (this.config.hooks?.onAfterRun) {
        yield* this.callHook(this.config.hooks.onAfterRun(context), context);
      }
    } catch (error) {
      let eventToEmit: Event | undefined;

      if (isEvent(error)) {
        eventToEmit = error;
      } else {
        // Wrap unexpected errors into an Event
        eventToEmit = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        };
      }

      if (eventToEmit) {
        yield* this.emit(eventToEmit, context);
      }

      return; // Gracefully stop the runtime
    }
  }

  private async *dispatchToBrain(
    event: Event,
    context: RuntimeContext<TState>
  ): AsyncGenerator<Event, NextAction | void> {
    const generator = this.config.brain!(event, context);
    while (true) {
      const { value, done } = await generator.next();
      if (done) return value as NextAction | void;
      yield* this.emit(value as Event, context);
    }
  }

  private async *executeAction(
    action: Action<any, TState>,
    nextAction: NextAction,
    context: RuntimeContext<TState>
  ): AsyncGenerator<Event, NextAction | void> {
    const params = nextAction.params;

    // 1. Trigger Plugins: onBeforeAction
    for (const plugin of this.config.plugins || []) {
      if (plugin.onBeforeAction) {
        const hookResult = yield* this.callHook(
          plugin.onBeforeAction({ action, params, nextAction }, context),
          context
        );
        if (hookResult) {
          nextAction = hookResult as NextAction;
        }
      }
    }

    // 2. Trigger Hook: onBeforeAction
    if (this.config.hooks?.onBeforeAction) {
      const hookResult = yield* this.callHook(
        this.config.hooks.onBeforeAction({ action, params, nextAction }, context),
        context
      );
      if (hookResult) {
        nextAction = hookResult as NextAction;
      }
    }

    try {
      const generator = action.execute(params, context);
      let result: NextAction | void;

      while (true) {
        const { value, done } = await generator.next();
        if (done) {
          result = value as NextAction | void;
          break;
        }
        yield* this.emit(value as Event, context);
      }

      // 3. Trigger Plugins: onAfterAction
      for (const plugin of this.config.plugins || []) {
        if (plugin.onAfterAction) {
          const extra = yield* this.callHook(
            plugin.onAfterAction({ action, data: result }, context),
            context
          );
          if (extra) {
            nextAction = extra as NextAction;
          }
        }
      }

      // 4. Trigger Hook: onAfterAction
      if (this.config.hooks?.onAfterAction) {
        const extra = yield* this.callHook(
          this.config.hooks.onAfterAction({ action, data: result }, context),
          context
        );
        if (extra) {
          nextAction = extra as NextAction;
        }
      }

      return result;
    } catch (error) {
      if (isEvent(error)) throw error;

      throw {
        type: "error",
        data: {
          action: action.name,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      };
    }
  }

  /**
   * Internal helper to call a hook (generator) and yield its events.
   */
  private async *callHook<T>(
    generator: HookGenerator<T> | undefined,
    context: RuntimeContext<TState>
  ): AsyncGenerator<Event, T | void> {
    if (!generator) return;

    while (true) {
      const { value, done } = await generator.next();
      if (done) return value as T | void;
      yield* this.emit(value as Event, context);
    }
  }

  /**
   * Internal helper to yield an event and trigger the onEvent hook.
   */
  private async *emit(
    event: Event,
    context: RuntimeContext<TState>
  ): AsyncGenerator<Event> {
    const finalEvent = {
      ...event,
      runId: context.runId,
      timestamp: event.timestamp ?? Date.now(),
      role: event.role ?? "assistant",
      state: context.state,
    };

    // Yield the actual event first
    yield finalEvent;

    // 1. Trigger Plugins: onEvent
    for (const plugin of this.config.plugins || []) {
      if (plugin.onEvent) {
        const generator = plugin.onEvent(finalEvent, context);
        for await (const extra of generator) {
          yield { ...extra, runId: context.runId, timestamp: Date.now() };
        }
      }
    }

    // 2. Trigger Hook: onEvent for side-effects or extra events
    if (this.config.hooks?.onEvent) {
      const generator = this.config.hooks.onEvent(finalEvent, context);
      for await (const extra of generator) {
        // Yield extra event from hook, ensuring it has required metadata
        yield { ...extra, runId: context.runId, timestamp: Date.now() };
      }
    }
  }
}

export const melony = <TState = any>(config: Config<TState>) => {
  const runtime = new Runtime<TState>(config);
  return {
    config,
    run: runtime.run.bind(runtime),
  };
};

/**
 * Helper to define an action with full type inference.
 */
export const action = <T extends z.ZodSchema, TState = any>(
  config: Action<T, TState>
): Action<T, TState> => config;

/**
 * Helper to define a plugin.
 */
export const plugin = <TState = any>(config: Plugin<TState>): Plugin<TState> =>
  config;
