import { Event, RuntimeContext } from "melony";
import { AgentState } from "@melony/agents";
import { LlmMessage, LlmProvider, LlmTool } from "@melony/llm";

export interface PlanStep {
  id: string;
  goal: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  action?: {
    type: string;
    data: any;
  };
  result?: any;
  error?: string;
  attempts: number;
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
  cursor: number;
  status: "active" | "completed" | "failed" | "replanning";
  replans: number;
  metadata?: Record<string, any>;
}

export interface PlanningState extends AgentState {
  plan?: Plan;
}

export const PlanningEvents = {
  Create: "plan:create",
  StepStart: "plan:step:start",
  StepResult: "plan:step:result",
  Replan: "plan:replan",
  Complete: "plan:complete",
  Failed: "plan:failed"
} as const;

export interface PlanStepInput {
  goal: string;
  action?: {
    type: string;
    data: any;
  };
  metadata?: Record<string, any>;
}

export interface ExecuteStepResult {
  result?: any;
  error?: string;
  replan?: { reason: string; input?: any };
  metadata?: Record<string, any>;
}

export interface PlannerStrategy<TState extends PlanningState = PlanningState, TEvent extends Event = Event> {
  createPlan: (args: {
    goal: string;
    input: any;
    context: RuntimeContext<TState, TEvent>;
  }) => Promise<{ steps: PlanStepInput[]; metadata?: Record<string, any> }>;
  replan?: (args: {
    plan: Plan;
    reason: string;
    input: any;
    context: RuntimeContext<TState, TEvent>;
  }) => Promise<{ steps: PlanStepInput[]; metadata?: Record<string, any> }>;
  executeStep?: (args: {
    step: PlanStep;
    plan: Plan;
    context: RuntimeContext<TState, TEvent>;
  }) => Promise<ExecuteStepResult>;
}

export interface DefaultPlannerStrategyOptions<
  TState extends PlanningState = PlanningState,
  TEvent extends Event = Event
> {
  provider: LlmProvider<TState, TEvent>;
  temperature?: number;
  maxOutputTokens?: number;
  maxPlanSteps?: number;
  systemPrompt?: string;
  toolSelector?: (context: RuntimeContext<TState, TEvent>) => LlmTool[];
}

export interface PlannerOptions<TState extends PlanningState = PlanningState, TEvent extends Event = Event> {
  strategy?: PlannerStrategy<TState, TEvent>;
  provider?: LlmProvider<TState, TEvent>;
  toolName?: string;
  toolDescription?: string;
  maxAttemptsPerStep?: number;
  maxReplans?: number;
  strategyOptions?: Omit<DefaultPlannerStrategyOptions<TState, TEvent>, "provider">;
}
