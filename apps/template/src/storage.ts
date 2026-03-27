import type { AgentPlugin } from "@melony/agents";
import { AgentEventTypes } from "./types.js";
import type { AgentState, AgentEvent } from "./types.js";

type EventEnvelope = {
  type?: string;
  data?: unknown;
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

  private shouldPersistEvent(event: TEvent): boolean {
    const eventType = event.type ?? "unknown";

    return !(
      event.meta?.internal ||
      event.meta?.volatile ||
      eventType === AgentEventTypes.RunsList ||
      eventType === AgentEventTypes.RunsListed ||
      eventType === AgentEventTypes.EventsList ||
      eventType === AgentEventTypes.EventsListed
    );
  }

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

  saveEvent(runId: string, event: TEvent, threadId?: string): boolean {
    if (!this.shouldPersistEvent(event)) {
      return false;
    }

    const run = this.runs.get(runId) ?? this.start(runId, threadId);
    const eventType = event.type ?? "unknown";

    run.events.push({
      type: eventType,
      payload: event,
      at: Date.now(),
    });

    run.updatedAt = Date.now();
    return true;
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
    builder.on(AgentEventTypes.RunsList, async function* () {
      const runs = storage.listRuns();

      yield {
        type: AgentEventTypes.RunsListed,
        data: { runs },
        meta: { internal: true },
      } as unknown as TEvent;
    });

    builder.on(AgentEventTypes.EventsList, async function* (event) {
      const runId = (event.data as { runId?: string } | undefined)?.runId;
      if (!runId) {
        return;
      }

      const events = storage.listEvents(runId);

      yield {
        type: AgentEventTypes.EventsListed,
        data: { events },
        meta: { internal: true },
      } as unknown as TEvent;
    });

    builder.intercept((event, context) => {
      const didPersist = storage.saveEvent(context.runId, event, context.state.threadId);
      if (didPersist) {
        storage.saveState(context.runId, context.state);
      }
      return event;
    });

    builder.on("agent:complete", async function* (_, context) {
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
