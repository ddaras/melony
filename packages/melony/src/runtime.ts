import {
  Action,
  Event,
  NextAction,
  RuntimeContext,
  Config,
  HookGenerator,
  Hooks,
} from "./types";
import { ui } from "./ui";
import { generateId } from "./utils/generate-id";

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
export class Runtime<TState = any, TEvent extends Event = Event> {
  public readonly config: Config<TState, TEvent>;
  private queue: TEvent[] = [];
  private isEmitting = false;

  constructor(config: Config<TState, TEvent>) {
    this.config = {
      ...config,
      plugins: [
        ...(config.plugins || []),
        // Normalize global hooks into an anonymous plugin for unified processing
        ...(config.hooks ? [{ name: "root", ...config.hooks }] : []),
      ],
    };
  }

  public async *run(event: TEvent): AsyncGenerator<TEvent> {
    const runId = event.meta?.runId ?? generateId();

    const context: RuntimeContext<TState, TEvent> = {
      state: (event.meta?.state ?? {}) as TState,
      runId,
      stepCount: 0,
      actions: this.config.actions,
      ui,
      suspend: (event?: TEvent) => {
        throw event || { type: "run-suspended", data: {} };
      },
    };

    try {
      let nextAction: NextAction | void = undefined;

      // 1. Trigger onBeforeRun Hook
      const result = yield* this.runHook("onBeforeRun", { event }, context);
      if (result) {
        nextAction = result as NextAction;
      }

      // Initial dispatch logic
      // Priority:
      // 1. nextAction already set by onBeforeRun hooks
      // 2. nextAction provided in the event itself
      if (!nextAction && event.nextAction) {
        nextAction = event.nextAction;
      }

      // Agentic loop
      while (nextAction) {
        if (context.stepCount++ >= (this.config.safetyMaxSteps ?? 10)) {
          yield* this.emit(
            { 
              type: "error", 
              data: { message: "Max steps exceeded" } 
            } as any,
            context,
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
            } as any,
            context,
          );
          break;
        }

        const action: Action<any, TState, TEvent> = this.config.actions[actionName];

        if (!action) {
          yield* this.emit(
            {
              type: "error",
              data: { message: `Action ${actionName} not found` },
            } as any,
            context,
          );
          break;
        }

        // 2. Execute Action
        nextAction = yield* this.executeAction(action, current, context);
      }

      // 2. Trigger onAfterRun Hook
      yield* this.runHook("onAfterRun", undefined, context);
    } catch (error) {
      let eventToEmit: TEvent | undefined;

      if (isEvent(error)) {
        eventToEmit = error as TEvent;
      } else {
        // Wrap unexpected errors into an Event
        eventToEmit = {
          type: "error",
          data: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        } as any;
      }

      if (eventToEmit) {
        yield* this.emit(eventToEmit, context);
      }

      return; // Gracefully stop the runtime
    }
  }

  private async *executeAction(
    action: Action<any, TState, TEvent>,
    nextAction: NextAction,
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent, NextAction | void> {
    const params = nextAction.params;

    // 1. Trigger onBeforeAction Hook
    const hookResult = yield* this.runHook(
      "onBeforeAction",
      { action, params, nextAction },
      context,
    );
    if (hookResult) {
      nextAction = hookResult as NextAction;
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
        yield* this.emit(value as TEvent, context);
      }

      // 2. Trigger onAfterAction Hook
      const extra = yield* this.runHook(
        "onAfterAction",
        { action, data: result },
        context,
      );
      if (extra) {
        nextAction = extra as NextAction;
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
    generator: HookGenerator<TEvent, T> | undefined,
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent, T | void> {
    if (!generator) return;

    while (true) {
      const { value, done } = await generator.next();
      if (done) return value as T | void;
      yield* this.emit(value as TEvent, context);
    }
  }

  /**
   * Runs a lifecycle hook across all registered plugins.
   * Last plugin that returns a value (like NextAction) wins.
   */
  private async *runHook<K extends keyof Hooks<TState, TEvent>>(
    hookName: K,
    args: any, // The first argument of the hook (event, context, or call info)
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent, any> {
    let lastResult: any = undefined;

    for (const plugin of this.config.plugins || []) {
      const hook = (plugin as any)[hookName];
      if (typeof hook === "function") {
        // Some hooks (like onAfterRun) only take context, others take (args, context)
        const generator =
          hookName === "onAfterRun"
            ? (hook as any)(context)
            : (hook as any)(args, context);

        const result = yield* this.callHook(generator, context);
        if (result !== undefined) {
          lastResult = result;
        }
      }
    }

    return lastResult;
  }

  /**
   * Internal helper to yield an event and trigger the onEvent hook.
   * Uses a queue to avoid recursive stack overflows when hooks emit more events.
   */
  private async *emit(
    event: TEvent,
    context: RuntimeContext<TState, TEvent>,
  ): AsyncGenerator<TEvent> {
    this.queue.push(event);

    if (this.isEmitting) return;

    this.isEmitting = true;
    try {
      while (this.queue.length > 0) {
        const current = this.queue.shift()!;

        const finalEvent: TEvent = {
          ...current,
          meta: {
            ...current.meta,
            id: current.meta?.id ?? generateId(),
            runId: context.runId,
            timestamp: current.meta?.timestamp ?? Date.now(),
            role: current.meta?.role ?? "assistant",
            state: context.state,
          },
        };

        // Yield the actual event first
        yield finalEvent;

        // Trigger onEvent hook for side-effects or extra events
        // Note: runHook calls callHook, which calls emit.
        // Since isEmitting is true, nested calls will just push to queue and return.
        yield* this.runHook("onEvent", finalEvent, context);
      }
    } finally {
      this.isEmitting = false;
    }
  }
}
