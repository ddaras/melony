import { MelonyPlugin } from "melony";

const runSequences = new Map<string, number>();

const nextSequence = (runId: string): number => {
  const next = (runSequences.get(runId) || 0) + 1;
  runSequences.set(runId, next);
  return next;
};

export interface InspectorOptions {
  /**
   * The URL of the Melony Studio server.
   * Defaults to http://localhost:7123
   */
  url?: string;
  /**
   * If true, the inspector will not send events.
   */
  disabled?: boolean;
  /**
   * The name of the application or abstraction being inspected.
   * If not provided, it will try to find a name in the state or use 'Anonymous'
   */
  name?: string;
}

/**
 * A Melony Plugin that captures all events and state changes
 * and sends them to the Melony Studio.
 */
export const inspector = (options: InspectorOptions = {}): MelonyPlugin => {
  const { url = "http://localhost:7123", disabled = false, name: overrideName } = options;
  const endpoint = `${url.replace(/\/$/, "")}/api/events`;

  return (builder) => {
    if (disabled) return;

    builder.intercept(async (event, context) => {
      // Try to find a name for identification: override -> state.name -> state.agent.name -> Anonymous
      const name = overrideName || (context.state as any)?.name || (context.state as any)?.agent?.name || 'Anonymous';
      const sequence = nextSequence(context.runId);

      const payload = {
        runId: context.runId,
        name,
        sequence,
        timestamp: Date.now(),
        event,
        state: context.state,
        type: 'intercept'
      };

      // Fire and forget to avoid slowing down the agent
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Silently fail if studio is not running
      });

      return event;
    });

    // We can also listen to all events emitted to ensure we capture yielded events
    builder.on("*", (event, context) => {
      const name = overrideName || (context.state as any)?.name || (context.state as any)?.agent?.name || 'Anonymous';
      const sequence = nextSequence(context.runId);

      const payload = {
        runId: context.runId,
        name,
        sequence,
        timestamp: Date.now(),
        event,
        state: context.state,
        type: 'emit'
      };

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

      if ((event as any)?.type === "agent:complete" || (event as any)?.type === "complete") {
        runSequences.delete(context.runId);
      }
    });
  };
};
