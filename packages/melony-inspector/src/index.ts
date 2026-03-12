import { AgentPlugin } from "@melony/agents";

const runSequences = new Map<string, number>();

const nextSequence = (runId: string): number => {
  const next = (runSequences.get(runId) || 0) + 1;
  runSequences.set(runId, next);
  return next;
};

export interface InspectorOptions {
  /**
   * The URL of the Melony Studio server.
   * Defaults to http://localhost:7777
   */
  url?: string;
  /**
   * If true, the inspector will not send events.
   */
  disabled?: boolean;
}

/**
 * An Agent Plugin that captures all events and state changes
 * and sends them to the Melony Studio.
 */
export const inspector = (options: InspectorOptions = {}): AgentPlugin => {
  const { url = "http://localhost:7777", disabled = false } = options;
  const endpoint = `${url.replace(/\/$/, "")}/api/events`;

  return (builder) => {
    if (disabled) return;

    builder.intercept(async (event, context) => {
      const agentState = (context.state as any)?.agent;
      const agentName = agentState?.name || 'Anonymous Agent';
      const sequence = nextSequence(context.runId);

      const payload = {
        runId: context.runId,
        agentName,
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
      const agentState = (context.state as any)?.agent;
      const agentName = agentState?.name || 'Anonymous Agent';
      const sequence = nextSequence(context.runId);

      const payload = {
        runId: context.runId,
        agentName,
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

      if ((event as any)?.type === "agent:complete") {
        runSequences.delete(context.runId);
      }
    });
  };
};
