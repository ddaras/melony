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
 * Special error to immediately interrupt the runtime.
 * This is used for Human-In-The-Loop (HITL) or other suspension cases.
 */
export class RuntimeInterruption extends Error {
  constructor(public event?: Event) {
    super("Runtime interrupted");
    this.name = "RuntimeInterruption";
  }
}

/**
 * The Slim Runtime.
 * Single Responsibility: Orchestrate Event -> Action -> Event transitions.
 */
export class Runtime {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public async *run(input: {
    event: Event;
  }): AsyncGenerator<Event> {
    const runId = input.event.runId ?? generateId();

    const context: RuntimeContext = {
      state: input.event.state ?? {},
      runId,
      stepCount: 0,
      actions: this.config.actions,
      ui,
      suspend: (event?: Event) => {
        throw new RuntimeInterruption(event);
      },
    };

    try {
      let nextAction: NextAction | void = undefined;

      // 1. Trigger Plugins: onBeforeRun
      for (const plugin of this.config.plugins || []) {
        if (plugin.onBeforeRun) {
          const result = yield* this.callHook(
            plugin.onBeforeRun({ event: input.event }, context),
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
          this.config.hooks.onBeforeRun({ event: input.event }, context),
          context
        );
        if (result) {
          nextAction = result as NextAction;
        }
      }

      yield* this.emit(
        { type: "run-started", data: { inputEvent: input.event } },
        context
      );

      // Initial dispatch of the incoming event to the agent's brain
      // Only if onBeforeRun didn't already provide a nextAction
      if (!nextAction && this.config.brain) {
        nextAction = yield* this.dispatchToBrain(input.event, context);
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
        const actionName: string =
          current.action ?? Object.keys(this.config.actions)[0];
        const action: Action<any> = this.config.actions[actionName];

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
                params: current.params,
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
      if (error instanceof RuntimeInterruption) {
        // If the suspension carried an event, emit it before finishing
        if (error.event) {
          yield* this.emit(error.event, context);
        }
        return;
      }
      throw error;
    }
  }

  private async *dispatchToBrain(
    event: Event,
    context: RuntimeContext
  ): AsyncGenerator<Event, NextAction | void> {
    const generator = this.config.brain!(event, context);
    while (true) {
      const { value, done } = await generator.next();
      if (done) return value as NextAction | void;
      yield* this.emit(value as Event, context);
    }
  }

  private async *executeAction(
    action: Action,
    nextAction: NextAction,
    context: RuntimeContext
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
      if (error instanceof RuntimeInterruption) throw error;

      yield* this.emit(
        {
          type: "error",
          data: {
            action: action.name,
            error: error instanceof Error ? error.message : String(error),
          },
        },
        context
      );
    }
  }

  /**
   * Internal helper to call a hook (generator) and yield its events.
   */
  private async *callHook<T>(
    generator: HookGenerator<T> | undefined,
    context: RuntimeContext
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
    context: RuntimeContext
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

export const melony = (config: Config) => {
  const runtime = new Runtime(config);
  return {
    config,
    run: runtime.run.bind(runtime),
  };
};

/**
 * Helper to define an action with full type inference.
 */
export const action = <T extends z.ZodSchema>(config: Action<T>): Action<T> =>
  config;

/**
 * Helper to define a plugin.
 */
export const plugin = (config: Plugin): Plugin => config;
