import { MelonyPlugin } from "melony";

export interface ObservabilityPluginOptions {
  /**
   * Function to log an event or metric.
   */
  log: (name: string, data: any) => void;
}

/**
 * Observability Plugin for Melony.
 * Tracks action performance and logs system events for monitoring.
 */
export const observabilityPlugin = (options: ObservabilityPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { log } = options;
  const actionStartTimes = new Map<string, number>();

  // Track action lifecycle
  builder.on("action:before", async function* (event) {
    const { action } = event.data as any;
    const runId = event.meta?.runId;
    const key = `${runId}:${action}`;
    
    actionStartTimes.set(key, Date.now());
    log("action_start", { action, runId });
  });

  builder.on("action:after", async function* (event) {
    const { action } = event.data as any;
    const runId = event.meta?.runId;
    const key = `${runId}:${action}`;
    
    const startTime = actionStartTimes.get(key);
    if (startTime) {
      const duration = Date.now() - startTime;
      log("action_complete", { action, runId, duration });
      actionStartTimes.delete(key);
    }
  });

  // Log errors
  builder.on("error", async function* (event) {
    log("error", { 
      message: (event.data as any).message, 
      runId: event.meta?.runId 
    });
  });
};
