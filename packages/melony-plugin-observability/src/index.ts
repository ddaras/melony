import { MelonyPlugin } from "melony";

export interface ObservabilityPluginOptions {
  /**
   * Function to log an event or metric.
   */
  log: (name: string, data: any) => void;
}

/**
 * Observability Plugin for Melony.
 * Logs events and errors for monitoring.
 */
export const observabilityPlugin = (options: ObservabilityPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { log } = options;

  // Log all events
  builder.on("*", async function* (event, context) {
    log("event", { 
      type: event.type, 
      runId: context.runId 
    });
  });

  // Log errors
  builder.on("error", async function* (event, context) {
    log("error", { 
      message: (event.data as any).message, 
      runId: context.runId 
    });
  });
};
