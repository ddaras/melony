import { plugin } from "../runtime";
import type { NextAction, RuntimeContext } from "../types";

export interface ServerlessSafeOptions {
  /**
   * Maximum duration in milliseconds before suspending the run.
   * @default 10000 (10 seconds)
   */
  maxDuration?: number;
}

/**
 * A plugin that monitors the runtime duration and suspends execution if it exceeds a limit.
 * This is particularly useful for serverless environments (e.g., Vercel, AWS Lambda)
 * to avoid hard timeouts and allow resuming the agentic loop in a subsequent request.
 */
export const serverlessSafe = (options: ServerlessSafeOptions = {}) => {
  const maxDuration = options.maxDuration ?? 10000;

  return plugin({
    name: "serverless-safe",

    onBeforeRun: async function* ({ event }, context) {
      // 1. If this is a resumption, return the nextAction to jump-start the loop
      if (event.type === "run-suspended" && event.data?.nextAction) {
        // Reset the start time for the new execution window
        context.state.__run_start_time = Date.now();
        return event.data.nextAction as NextAction;
      }

      // 2. Initialize the start time for a fresh run
      context.state.__run_start_time = Date.now();
    },

    onBeforeAction: async function* ({ nextAction }, context) {
      const startTime = context.state.__run_start_time;
      if (!startTime) return;

      const elapsed = Date.now() - startTime;

      if (elapsed > maxDuration) {
        // Remove the internal start time from state before suspending
        delete context.state.__run_start_time;

        // Suspend the runtime and yield a special event that the client can use to resume
        context.suspend({
          type: "run-suspended",
          data: {
            nextAction,
            elapsed,
            maxDuration,
          },
          role: "system",
        });
      }
    },

    onAfterRun: async function* (context) {
      // Cleanup
      delete context.state.__run_start_time;
    },
  });
};

