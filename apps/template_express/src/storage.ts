import type { AgentPlugin } from "@melony/agents";
import { AgentEventTypes } from "./types.js";
import type { AgentState, AgentEvent } from "./types.js";

type EventEnvelope = {
  type?: string;
  meta?: {
    internal?: boolean;
    volatile?: boolean;
  };
};

export type StoredEvent<TEvent> = {
  type: string;
  payload: TEvent;
  at: number;
};

type RunStatus = "pending" | "running" | "completed" | "failed";

export type StoredRun<TState = unknown, TEvent = unknown> = {
  runId: string;
  threadId?: string;
  status: RunStatus;
  createdAt: number;
  updatedAt: number;
  state?: TState;
  events: StoredEvent<TEvent>[];
};

export class InMemoryRunStorage<TState extends { threadId?: string } = { threadId?: string }, TEvent extends EventEnvelope = EventEnvelope> {
  private runs = new Map<string, StoredRun<TState, TEvent>>();

  start(runId: string, threadId?: string): StoredRun<TState, TEvent> {
    const now = Date.now();
    const current = this.runs.get(runId);
    if (current) {
      return current;
    }

    const run: StoredRun<TState, TEvent> = {
      runId,
      threadId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      events: [],
    };
    this.runs.set(runId, run);
    return run;
  }

  saveEvent(runId: string, event: TEvent): void {
    const run = this.runs.get(runId) ?? this.start(runId);
    const eventType = event.type ?? "unknown";

    run.events.push({
      type: eventType,
      payload: event,
      at: Date.now(),
    });

    if (eventType === AgentEventTypes.RunError || eventType === "llm:error") run.status = "failed";
    if (eventType === AgentEventTypes.AgentRun) run.status = "running";
    if (eventType === AgentEventTypes.AgentComplete) run.status = "completed";

    // Handle explicit status events
    if (eventType === AgentEventTypes.AgentStatus || eventType === AgentEventTypes.RunStatus) {
      const status = (event as any).status;
      if (status === "thinking" || status === "running") {
        run.status = "running";
      } else if (status === "completed" || status === "failed") {
        run.status = status;
      }
    }

    run.updatedAt = Date.now();
  }

  saveState(runId: string, state: TState): void {
    const run = this.runs.get(runId) ?? this.start(runId);
    run.state = state;
    run.updatedAt = Date.now();
  }

  complete(runId: string): void {
    const run = this.runs.get(runId) ?? this.start(runId);
    run.status = "completed";
    run.updatedAt = Date.now();
  }

  getRun(runId: string): StoredRun<TState, TEvent> | undefined {
    return this.runs.get(runId);
  }

  listRuns(): StoredRun<TState, TEvent>[] {
    return Array.from(this.runs.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  listEvents(runId: string): StoredEvent<TEvent>[] {
    return this.runs.get(runId)?.events ?? [];
  }
}

export function inMemoryStoragePlugin<
  TState extends { threadId?: string },
  TEvent extends EventEnvelope
>(storage: InMemoryRunStorage<TState, TEvent>): AgentPlugin<TState, TEvent> {
  return (builder) => {
    builder.intercept((event, context) => {
      const eventType = event.type ?? "unknown";
      const isNonPersistentEvent =
        event.meta?.internal ||
        event.meta?.volatile ||
        eventType === AgentEventTypes.RunsList ||
        eventType === AgentEventTypes.RunsListed;

      if (isNonPersistentEvent) {
        return event;
      }

      storage.start(context.runId, context.state.threadId);
      storage.saveEvent(context.runId, event);
      storage.saveState(context.runId, context.state);
      return event;
    });

    builder.on(AgentEventTypes.AgentComplete, async function* (_, context) {
      // Do not create run records for non-persistent/internal-only flows.
      if (!storage.getRun(context.runId)) {
        return;
      }
      storage.complete(context.runId);
      storage.saveState(context.runId, context.state);
    });
  };
}

export const appStorage = new InMemoryRunStorage<AgentState, AgentEvent>();
