import {
  Action,
  Runtime,
  RuntimeInput,
  MelonyEvent,
  RuntimeContext,
  NextAction,
  PendingActionsStore,
} from "@melony/core";
import { defineRuntime } from "@melony/runtime";
import z from "zod";

// Re-export utilities
export * from "./create-handler";

// -- Types for the Brain Abstraction --

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: z.ZodSchema;
};

export interface AgentConfig {
  name: string;
  description?: string;
  actions: Record<string, Action<any>>;
  /**
   * Optional store for HITL pending actions.
   * Required if any action uses requiresApproval.
   */
  pendingActionsStore?: PendingActionsStore;
  /**
   * Maximum number of steps before stopping (default: 10)
   */
  safetyMaxSteps?: number;
  /**
   * Framework-agnostic brain.
   * Receives the runtime context (with state), tool definitions, and current input.
   * The last result from the previous action is available in context.state.lastResult.
   * You can use OpenAI, Anthropic, or custom logic here.
   * Yield any events you want, and return a NextAction to continue or void/undefined to stop.
   */
  brain: (
    context: RuntimeContext,
    toolDefinitions: ToolDefinition[],
    options: {
      input?: any;
    }
  ) => AsyncGenerator<MelonyEvent, NextAction | void, unknown>;
}

// -- Helper to convert Melony Actions to LLM Tool Schemas --

export function getToolDefinitions(actions: Record<string, Action<any>>) {
  return Object.entries(actions).map(([name, action]) => ({
    name,
    description: action.description || `Execute ${action.name}`,
    parameters: action.paramsSchema.shape,
  }));
}

// -- Internal Schemas --

const BrainParamsSchema = z.object({
  input: z.any().optional(), // Allow any input type - users can structure it as needed
});

// -- Main Agent Class --

export class Agent {
  private runtime: Runtime;
  public readonly config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
    this.runtime = this.initializeRuntime();
  }

  private initializeRuntime(): Runtime {
    const { actions, brain } = this.config;
    const wrappedActions: Record<string, Action<any>> = {};
    const toolDefinitions = getToolDefinitions(actions);

    // 1. WRAP USER ACTIONS
    // Forces every action to loop back to 'brain' after execution
    for (const [key, action] of Object.entries(actions)) {
      wrappedActions[key] = {
        ...action,
        execute: async function* (params, context) {
          // Run the actual action logic
          const generator = action.execute(params, context);
          let output = null;

          while (true) {
            const { value, done } = await generator.next();
            if (done) {
              output = value;
              break;
            }

            yield value;
          }

          // Store last result in state for brain to access
          if (typeof output === "object" && "description" in output) {
            context.state.lastActionResult = {
              action: key,
              result: output.description,
            };
          }

          // AUTOMATIC RETURN TO BRAIN
          return {
            action: "brain",
            params: {},
          };
        },
      };
    }

    // 2. DEFINE THE BRAIN ACTION
    const brainAction: Action<typeof BrainParamsSchema> = {
      name: "brain",
      description: "Decides the next step",
      paramsSchema: BrainParamsSchema,
      execute: async function* (params, context) {
        // CALL THE BRAIN (User's Framework Agnostic Logic)
        // Pass the full runtime context - users can access state, runId, stepCount, etc.
        // Last result is available in context.state.lastResult
        const brainGenerator = brain(context, toolDefinitions, {
          input: params.input,
        });

        let decision: NextAction | void = undefined;

        // Iterate through all events yielded by the brain
        while (true) {
          const { value, done } = await brainGenerator.next();

          if (done) {
            // The generator is done, value contains the return value (decision)
            decision = value;
            break;
          }

          // Yield any events the brain produces
          yield value as MelonyEvent;
        }

        // If brain returned a NextAction, continue with that action
        // If it returned void/undefined, stop execution
        if (decision && typeof decision === "object" && "action" in decision) {
          return decision;
        }
        // Otherwise, return void to stop
      },
    };

    wrappedActions["brain"] = brainAction;

    return defineRuntime({
      actions: wrappedActions,
      pendingActionsStore: this.config.pendingActionsStore,
      safetyMaxSteps: this.config.safetyMaxSteps,
    });
  }

  public async *run(
    input: NextAction,
    options: {
      state?: Record<string, any>;
      runId?: string;
      pendingActionsStore?: PendingActionsStore;
    } = {}
  ): AsyncGenerator<MelonyEvent> {
    // If a pendingActionsStore is provided and we don't have one configured,
    // reinitialize the runtime with the new store
    if (options.pendingActionsStore && !this.config.pendingActionsStore) {
      this.config.pendingActionsStore = options.pendingActionsStore;
      this.runtime = this.initializeRuntime();
    }

    const runtimeInput: RuntimeInput = {
      start: input,
      state: options.state || {},
      runId: options.runId,
    };

    yield* this.runtime.run(runtimeInput);
  }
}

export const defineAgent = (config: AgentConfig) => new Agent(config);
