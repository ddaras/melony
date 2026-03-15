import { PlanStep, PlanStepInput } from "./types";

export function toPlanSteps(steps: PlanStepInput[]): PlanStep[] {
  return steps.map((step) => ({
    task: step.task,
    status: "pending"
  }));
}
