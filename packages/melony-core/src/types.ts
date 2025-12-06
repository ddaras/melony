import z from "zod";

// events
export type MelonyEvent = {
  type: string;
  data?: any;
  id?: string;
  runId?: string;
  version?: string;
  timestamp?: number;
};

// runtime
export interface RuntimeConfig {
  actions: Record<string, Action>;
  safetyMaxSteps?: number;
}

export interface RuntimeInput {
  start: NextAction;
  runId?: string;
  state?: Record<string, any>;
}

export interface Runtime {
  run(input: RuntimeInput): AsyncGenerator<MelonyEvent>;
}

export interface RuntimeContext<TState = any> {
  state: TState;
  initialAction: NextAction;
  runId: string;
  stepCount: number;
  isDone: boolean;
  actions: Record<string, Action>;
}

// actions
// none of the fields are required, because it might be used with Agent which only looks for description
export interface NextAction {
  action?: string;
  params?: any;
  description?: string;
}

export interface Action<TParams extends z.ZodSchema = z.ZodObject<any>> {
  name: string;
  description?: string;
  paramsSchema: TParams;
  execute: (
    params: z.infer<TParams>,
    context: RuntimeContext
  ) => AsyncGenerator<MelonyEvent, NextAction | void, unknown>;
}
