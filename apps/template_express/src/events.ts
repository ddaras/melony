export type RunStatusEvent = {
  type: "run:status";
  status: "pending" | "running" | "completed" | "failed";
};

export type RunErrorEvent = {
  type: "run:error";
  message: string;
};

export type RunEvent = RunStatusEvent | RunErrorEvent;