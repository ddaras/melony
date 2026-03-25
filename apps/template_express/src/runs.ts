import { generateId } from 'melony';
import { RunEvent } from './events.js';

export type RunState = {
  threadId: string;
  sessionId: string;
};

interface Run {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  events: (RunBaseEvent & RunEvent)[];
  state: RunState;
  startTime: number;
  endTime?: number;
}

type RunStatus = "pending" | "running" | "completed" | "failed";

type EventHandler = (event: RunEvent) => void;

type RunBaseEvent = {
  id: string;
  timestamp: number;
  meta: { runId: string; threadId: string, volatile?: boolean };
};

/**
 * Manages runs and events for a Melony server.
 * This is a simple in-memory store that can be replaced with a database.
 */
export class RunManager {
  private runs: Map<string, Run> = new Map();
  private listeners: Map<string, Set<EventHandler>> = new Map();

  /**
   * Create a new run and start tracking it.
   */
  public createRun(state: RunState = { threadId: '', sessionId: '' }): Run {
    const run: Run = {
      id: generateId(),
      status: "pending",
      events: [],
      state,
      startTime: Date.now(),
    };
    this.runs.set(run.id, run);
    return run;
  }

  /**
   * Update the status of a run.
   */
  public updateRunStatus(runId: string, status: RunStatus) {
    const run = this.runs.get(runId);
    if (run) {
      run.status = status;
      if (status === "completed" || status === "failed") {
        run.endTime = Date.now();
      }
      this.emitEvent(runId, {
        id: generateId(),
        timestamp: Date.now(),
        meta: {
          runId,
          threadId: run?.state?.threadId
        },
        type: "run:status",
        status
      });
    }
  }

  /**
   * Add an event to a run and emit it to subscribers.
   */
  public emitEvent(runId: string, event: Partial<RunBaseEvent> & RunEvent) {
    const run = this.runs.get(runId);
    if (run) {
      const enrichedEvent = {
        ...event,
        id: event.id ?? generateId(),
        timestamp: event.timestamp ?? Date.now(),
        meta: { ...event.meta, runId, threadId: run?.state?.threadId },
      };

      // Skip storing volatile events (like deltas) while still notifying listeners
      if (!enrichedEvent.meta?.volatile) {
        run.events.push(enrichedEvent);
      }

      this.notify(`events:${runId}`, enrichedEvent);
      if (run?.state?.threadId) {
        this.notify(`events:thread:${run?.state?.threadId}`, enrichedEvent);
      }
      this.notify("events:*", enrichedEvent);
    }
  }

  private notify(eventName: string, event: RunEvent) {
    const handlers = this.listeners.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }

  /**
   * Get a run by ID.
   */
  public getRun(runId: string): Run | undefined {
    return this.runs.get(runId);
  }

  /**
   * Subscribe to events for a specific run, thread, or all events.
   */
  public subscribe(
    filter: { runId?: string; threadId?: string },
    handler: EventHandler
  ) {
    let eventName = "events:*";
    if (filter.runId) {
      eventName = `events:${filter.runId}`;
    } else if (filter.threadId) {
      eventName = `events:thread:${filter.threadId}`;
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler);

    return () => {
      const handlers = this.listeners.get(eventName);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(eventName);
        }
      }
    };
  }

  /**
   * Get historical events for a run or thread.
   */
  public getEvents(filter: { runId?: string; threadId?: string }): RunEvent[] {
    if (filter.runId) {
      return this.runs.get(filter.runId)?.events ?? [];
    }
    if (filter.threadId) {
      const threadEvents: (RunBaseEvent & RunEvent)[] = [];
      for (const run of this.runs.values()) {
        if (run?.state?.threadId === filter.threadId) {
          threadEvents.push(...run.events);
        }
      }
      return threadEvents.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
    }
    return [];
  }

  /**
   * List all runs, optionally filtered by thread ID.
   */
  public listRuns(filter?: { threadId?: string }): Run[] {
    const allRuns = Array.from(this.runs.values());
    if (filter?.threadId) {
      return allRuns.filter(run => run?.state?.threadId === filter.threadId);
    }
    return allRuns;
  }

  /**
   * List all unique thread IDs.
   */
  public listThreads(): string[] {
    const threadIds = new Set<string>();
    for (const run of this.runs.values()) {
      if (run?.state?.threadId) {
        threadIds.add(run?.state?.threadId);
      }
    }
    return Array.from(threadIds);
  }
}

// Global run manager singleton for convenience
export const runManager = new RunManager();
