import { AgentState as BaseAgentState } from '@melony/agents';
import type { StoredEvent, StoredRun } from './storage.js';

export type AgentStatus = 'thinking' | 'running' | 'completed' | 'failed';

export type AgentState = BaseAgentState & {
  threadId?: string;
  runId?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
};

type EventMeta = {
  internal?: boolean;
  volatile?: boolean;
};

export const AgentEventTypes = {
  UserIntent: 'user:intent',
  AgentRun: 'agent:run',
  RunStatus: 'run:status',
  AgentStatus: 'agent:status',
  RunError: 'run:error',
  RunsList: 'runs:list',
  RunsListed: 'runs:listed',
  EventsList: 'events:list',
  EventsListed: 'events:listed',
  AgentComplete: 'agent:complete',
} as const;

export type UserIntentEvent = {
  type: typeof AgentEventTypes.UserIntent;
  data: { text: string };
};

export type AgentRunEvent = {
  type: typeof AgentEventTypes.AgentRun;
  data: { text: string };
};

export type RunStatusEvent = {
  type: typeof AgentEventTypes.RunStatus;
  data: {
    status: "pending" | "running" | "completed" | "failed";
  }
};

export type AgentStatusEvent = {
  type: typeof AgentEventTypes.AgentStatus;
  data: {
    status: AgentStatus;
  }
};

export type RunErrorEvent = {
  type: typeof AgentEventTypes.RunError;
  data: {
    message: string;
  }
};

export type RunsListEvent = {
  type: typeof AgentEventTypes.RunsList;
  meta?: EventMeta;
};

export type RunsListedEvent = {
  type: typeof AgentEventTypes.RunsListed;
  data: {
    runs: StoredRun<AgentState, AgentEvent>[];
  };
  meta?: EventMeta;
};

export type EventsListEvent = {
  type: typeof AgentEventTypes.EventsList;
  data: { runId: string };
  meta?: EventMeta;
};

export type EventsListedEvent = {
  type: typeof AgentEventTypes.EventsListed;
  data: { events: StoredEvent<AgentEvent>[] };
  meta?: EventMeta;
};

export type AgentCompleteEvent = {
  type: typeof AgentEventTypes.AgentComplete;
  data: {
    agent: string;
  }
};

export type AgentEvent =
  | UserIntentEvent
  | AgentRunEvent
  | RunStatusEvent
  | RunErrorEvent
  | AgentStatusEvent
  | AgentCompleteEvent
  | RunsListEvent
  | RunsListedEvent
  | EventsListEvent
  | EventsListedEvent;

export function isRunsListEvent(event: AgentEvent): event is RunsListEvent {
  return event.type === AgentEventTypes.RunsList;
}

export function isUserIntentEvent(event: AgentEvent): event is UserIntentEvent {
  return event.type === AgentEventTypes.UserIntent;
}

export function isEventsListEvent(event: AgentEvent): event is EventsListEvent {
  return event.type === AgentEventTypes.EventsList;
}