import { Event, RuntimeContext } from "melony";
import { ExecuteStepResult, PlanStep, PlanningState } from "./types";

export async function executeActionStep<TState extends PlanningState, TEvent extends Event>(
  args: {
    step: PlanStep;
    context: RuntimeContext<TState, TEvent>;
  }
): Promise<ExecuteStepResult> {
  const { step, context } = args;
  if (!step.action) {
    return { error: `Step "${step.id}" has no action and no step executor is configured.` };
  }

  let sawResult = false;
  let output: ExecuteStepResult = { error: `Action "${step.action.type}" produced no result event.` };

  for await (const actionEvent of context.runtime.run(
    {
      type: `action:call:${step.action.type}`,
      data: {
        id: step.id,
        name: step.action.type,
        args: step.action.data
      }
    } as unknown as TEvent,
    { state: context.state, runId: context.runId }
  )) {
    const eventType = (actionEvent as any)?.type;
    const data = (actionEvent as any)?.data ?? {};
    const toolCallId = data?.toolCallId;
    const matchesStep = !toolCallId || toolCallId === step.id;

    if (eventType === "action:result" && matchesStep) {
      sawResult = true;
      output = { result: data?.result };
      break;
    }
    if (eventType === "action:error" && matchesStep) {
      sawResult = true;
      output = { error: String(data?.error ?? "Unknown action error") };
      break;
    }
  }

  if (!sawResult) {
    return output;
  }
  return output;
}
