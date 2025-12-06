import {
  Action,
  MelonyEvent,
  NextAction,
  RuntimeContext,
  generateId,
  RuntimeConfig,
  RuntimeInput,
  Runtime,
} from "@melony/core";

/**
 * Simple action runner - executes actions and yields events
 * Actions are always async generators and can chain to other actions
 */
export class MelonyRuntime implements Runtime {
  private config: RuntimeConfig;

  constructor(config: RuntimeConfig) {
    this.config = config;
  }

  public async *run({
    start: initialAction,
    runId: initialRunId,
    state: initialState,
  }: RuntimeInput): AsyncGenerator<MelonyEvent> {
    const runId = initialRunId ?? generateId();

    const actions = this.config.actions;

    const context: RuntimeContext = {
      state: initialState ?? {},
      initialAction: initialAction ?? { action: Object.keys(actions)[0] },
      runId,
      stepCount: 0,
      isDone: false,
      actions,
    };

    const action =
      actions[context.initialAction?.action ?? Object.keys(actions)[0]];

    if (!action) {
      yield {
        type: "error",
        version: "1.0.0",
        runId: runId,
        timestamp: Date.now(),
        data: {
          message: `Action "${initialAction}" not found`,
        },
      };

      return;
    }

    yield* this.executeAction(action, context.initialAction?.params, context);
  }

  private async *executeAction(
    action: Action,
    args: any,
    context: RuntimeContext
  ): AsyncGenerator<MelonyEvent> {
    if (
      context.stepCount >= (this.config.safetyMaxSteps ?? 10) ||
      context.isDone
    ) {
      return;
    }

    context.stepCount++;

    try {
      const generator = action.execute(args, context);
      let nextAction: NextAction | void;

      // execute the action until it returns a next action or the action is done or the context is done
      while (true) {
        const { value, done } = await generator.next();

        if (done) {
          nextAction = value;
          break;
        }

        // Yield event with runId and timestamp
        yield { ...value, runId: context.runId, timestamp: Date.now() };

        // Check if context was marked as done
        if (context.isDone) {
          return; // stop the execution loop
        }
      }

      // If action returned a next action, execute it
      if (
        nextAction &&
        typeof nextAction === "object" &&
        "action" in nextAction
      ) {
        const next = context.actions[nextAction?.action ?? Object.keys(context.actions)[0]];

        if (next) {
          yield* this.executeAction(next, nextAction?.params, context);
        } else {
          yield {
            type: "error",
            version: "1.0.0",
            runId: context.runId,
            timestamp: Date.now(),
            data: {
              message: `Action "${nextAction.action}" not found`,
              requestedBy: action.name,
            },
          };
        }
      }
    } catch (error) {
      yield {
        type: "error",
        version: "1.0.0",
        runId: context.runId,
        timestamp: Date.now(),
        data: {
          action: action?.name ?? "unknown",
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}
