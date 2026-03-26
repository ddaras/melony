export type UserIntentEvent = {
  type: "user:intent";
  data: { text: string };
};

export type AgentRunEvent = {
  type: "agent:run";
  data: { text: string };
};

export type RunStatusEvent = {
  type: "run:status";
  status: "pending" | "running" | "completed" | "failed";
};

export type AgentStatusEvent = {
  type: "agent:status";
  status: string;
};

export type RunErrorEvent = {
  type: "run:error";
  message: string;
};

export type RunsListEvent = {
  type: "runs:list";
};

export type RunsListedEvent = {
  type: "runs:listed";
  data: {
    runs: unknown[];
  };
};

export type RunEvent =
  | UserIntentEvent
  | AgentRunEvent
  | RunStatusEvent
  | RunErrorEvent
  | AgentStatusEvent
  | RunsListEvent
  | RunsListedEvent;
