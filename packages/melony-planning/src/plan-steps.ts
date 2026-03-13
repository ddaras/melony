import { generateId } from "melony";
import { PlanStep, PlanStepInput } from "./types";

export function toPlanSteps(steps: PlanStepInput[]): PlanStep[] {
  return steps.map((step) => ({
    id: generateId(),
    goal: step.goal,
    status: "pending",
    action: step.action,
    attempts: 0
  }));
}
