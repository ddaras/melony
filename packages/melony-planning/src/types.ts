import { Event, RuntimeContext } from "melony";
import { AgentState } from "@melony/agents";

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
  metadata?: Record<string, any>;
}

export interface PlanningState extends AgentState {
  plan?: Plan;
}

export const PlanningEvents = {
  Create: "plan:create",
  Created: "plan:created",
  StepStart: "plan:step:start",
  StepResult: "plan:step:result",
  Replan: "plan:replan",
  Complete: "plan:complete",
  Failed: "plan:failed",
} as const;

export type PlanningEvent =
  | { type: typeof PlanningEvents.Create; data: { goal: string } }
  | { type: typeof PlanningEvents.Created; data: Plan }
  | { type: typeof PlanningEvents.StepStart; data: { stepId: string } }
  | { type: typeof PlanningEvents.StepResult; data: { stepId: string; result?: any; error?: string } }
  | { type: typeof PlanningEvents.Replan; data: { reason: string } }
  | { type: typeof PlanningEvents.Complete; data: { result: any } }
  | { type: typeof PlanningEvents.Failed; data: { error: string } };

export interface PlannerOptions<TState extends PlanningState = PlanningState, TEvent extends Event = Event> {
  maxAttemptsPerStep?: number;
  maxReplans?: number;
}
