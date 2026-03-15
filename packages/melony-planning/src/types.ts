import { Event, RuntimeContext } from "melony";
import { AgentState } from "@melony/agents";
import { LlmMessage, LlmProvider, LlmTool } from "@melony/llm";

export interface PlanStep {
  task: string;
  status: "pending" | "in-progress" | "completed";
}

export interface Plan {
  id: string;
  goal: string;
  steps: PlanStep[];
  status: "active" | "completed";
  metadata?: Record<string, any>;
}

export interface PlanningState extends AgentState {
  plan?: Plan;
}

export const PlanningEvents = {
  Create: "plan:create",
  UpdateStep: "plan:step:update",
  Complete: "plan:complete"
} as const;

export interface PlanStepInput {
  task: string;
  metadata?: Record<string, any>;
}

export interface PlannerStrategy<TState extends PlanningState = PlanningState, TEvent extends Event = Event> {
  createPlan: (args: {
    goal: string;
    input: any;
    context: RuntimeContext<TState, TEvent>;
  }) => Promise<{ steps: PlanStepInput[]; metadata?: Record<string, any> }>;
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
  updateToolName?: string;
  updateToolDescription?: string;
  maxAttemptsPerStep?: number;
  maxReplans?: number;
  strategyOptions?: Omit<DefaultPlannerStrategyOptions<TState, TEvent>, "provider">;
}
