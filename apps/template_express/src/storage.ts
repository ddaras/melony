import type { AgentPlugin } from "@melony/agents";

type StoredEvent = {
  type: string;
  payload: unknown;
  at: number;
};

type RunStatus = "pending" | "running" | "completed" | "failed";

export type StoredRun<TState = unknown> = {
  runId: string;
  threadId?: string;
  status: RunStatus;
  createdAt: number;
  updatedAt: number;
  state?: TState;
  events: StoredEvent[];
};

export class InMemoryRunStorage<TState = unknown> {
  private runs = new Map<string, StoredRun<TState>>();

  start(runId: string, threadId?: string): StoredRun<TState> {
    const now = Date.now();
    const current = this.runs.get(runId);
    if (current) {
      return current;
    }

    const run: StoredRun<TState> = {
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

  saveEvent(runId: string, event: any): void {
    const run = this.runs.get(runId) ?? this.start(runId);
    const eventType = event?.type ?? "unknown";

    // Skip internal events (don't save them in run history)
    if (event?.meta?.internal) {
      return;
    }

    // Skip volatile events (e.g. LLM deltas)
    if (event?.meta?.volatile) {
      return;
    }

    // Legacy circularity check as a fallback
    if (eventType === "runs:list" || eventType === "runs:listed") {
      return;
    }

    run.events.push({
      type: eventType,
      payload: event,
      at: Date.now(),
    });

    if (eventType === "run:error") run.status = "failed";
    if (eventType === "agent:run") run.status = "running";
    if (eventType === "agent:complete") run.status = "completed";

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

  getRun(runId: string): StoredRun<TState> | undefined {
    return this.runs.get(runId);
  }

  listRuns(): StoredRun<TState>[] {
    return Array.from(this.runs.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export function inMemoryStoragePlugin<TState = unknown>(
  storage: InMemoryRunStorage<any>
): AgentPlugin<TState, any> {
  return (builder) => {
    builder.intercept((event, context) => {
      const state = context.state as any;
      storage.start(context.runId, state?.threadId);
      storage.saveEvent(context.runId, event);
      storage.saveState(context.runId, context.state);
      return event;
    });

    builder.on("agent:complete", async function* (_, context) {
      storage.complete(context.runId);
      storage.saveState(context.runId, context.state);
    });
  };
}

export const appStorage = new InMemoryRunStorage<any>();
