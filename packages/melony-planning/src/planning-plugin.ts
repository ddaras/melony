import { AgentEvents, AgentPlugin } from "@melony/agents";
import { Event, generateId } from "melony";
import { createDefaultPlannerStrategy } from "./default-planner-strategy";
import { executeActionStep } from "./execute-action-step";
import { toPlanSteps } from "./plan-steps";
import { Plan, PlannerOptions, PlanningEvents, PlanningState } from "./types";

/**
 * Simplified planning plugin that provides a tool for the agent to decide when to plan.
 */
export function planning<TState extends PlanningState = PlanningState, TEvent extends Event = Event>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  const {
    toolName = "plan",
    toolDescription = "Create and execute a multi-step plan to achieve a goal.",
    maxAttemptsPerStep = 3,
    maxReplans = 2
  } = options;

  const strategy =
    options.strategy ??
    (options.provider
      ? createDefaultPlannerStrategy<TState, TEvent>({
          provider: options.provider,
          ...(options.strategyOptions ?? {})
        })
      : undefined);
  const callEventType = `action:call:${toolName}`;

  return (builder) => {
    // Register the plan tool by intercepting any event and ensuring the tool is in state
    builder.intercept((event, context) => {
      const state = context.state as any;
      if (!state.actions) state.actions = [];
      const hasTool = state.actions.some((a: any) => a.name === toolName);
      if (!hasTool) {
        state.actions.push({
          name: toolName,
          description: toolDescription,
          parameters: {
            type: "object",
            properties: {
              goal: { type: "string", description: "The goal to achieve" }
            },
            required: ["goal"]
          }
        });
      }
      return event;
    });

    // Handle the plan tool call
    builder.on(callEventType as any, async function* (event: any, context) {
      const goal = String(event.data.args?.goal ?? "").trim();
      const toolCallId = event.data.id;

      if (!goal) {
        yield {
          type: "action:error",
          data: { action: toolName, toolCallId, error: "Goal is required for planning." }
        } as any;
        return;
      }

      if (!strategy) {
        yield {
          type: "action:error",
          data: { action: toolName, toolCallId, error: "No planner strategy configured." }
        } as any;
        return;
      }

      // 1. Create Plan
      yield { type: PlanningEvents.Create, data: { goal } } as any;
      const created = await strategy.createPlan({ goal, input: event.data.args, context });
      
      const plan: Plan = {
        id: generateId(),
        goal,
        steps: toPlanSteps(created.steps),
        cursor: 0,
        status: "active",
        replans: 0,
        metadata: created.metadata
      };
      context.state.plan = plan;

      // 2. Execute Steps
      while (plan.cursor < plan.steps.length && plan.status === "active") {
        const step = plan.steps[plan.cursor];
        yield { type: PlanningEvents.StepStart, data: { stepId: step.id } } as any;

        step.status = "running";
        const execution = strategy.executeStep 
          ? await strategy.executeStep({ step, plan, context })
          : await executeActionStep({ step, context });

        if (execution.replan && plan.replans < maxReplans) {
          plan.replans++;
          plan.status = "replanning";
          yield { type: PlanningEvents.Replan, data: { reason: execution.replan.reason } } as any;
          
          if (strategy.replan) {
            const replanned = await strategy.replan({ 
              plan, 
              reason: execution.replan.reason, 
              input: execution.replan.input, 
              context 
            });
            plan.steps = toPlanSteps(replanned.steps);
            plan.cursor = 0;
            plan.status = "active";
            continue;
          }
        }

        if (execution.error) {
          step.attempts++;
          if (step.attempts >= maxAttemptsPerStep) {
            step.status = "failed";
            plan.status = "failed";
            yield { type: PlanningEvents.Failed, data: { error: execution.error } } as any;
            break;
          }
          // Retry same step
          continue;
        }

        step.status = "completed";
        step.result = execution.result;
        yield { type: PlanningEvents.StepResult, data: { stepId: step.id, result: step.result } } as any;
        
        plan.cursor++;
      }

      if (plan.status === "active" || plan.status === "completed") {
        plan.status = "completed";
        yield { type: PlanningEvents.Complete, data: { result: plan.steps.map(s => s.result) } } as any;
      }
      
      // Return the final result to the agent as the tool output
      yield { 
        type: "action:result", 
        data: { 
          action: toolName,
          toolCallId, 
          result: { 
            status: plan.status, 
            goal: plan.goal, 
            steps: plan.steps.map(s => ({ goal: s.goal, status: s.status, result: s.result, error: s.error })) 
          } 
        } 
      } as any;
    });
  };
}

export function planner<TState extends PlanningState = PlanningState, TEvent extends Event = Event>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  return planning(options);
}
