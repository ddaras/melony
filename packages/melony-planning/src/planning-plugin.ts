import { AgentPlugin } from "@melony/agents";
import { generateId, RuntimeContext } from "melony";
import { createDefaultPlannerStrategy } from "./default-planner-strategy";
import { toPlanSteps } from "./plan-steps";
import { Plan, PlannerOptions, PlanningEvents, PlanningState } from "./types";

/**
 * Simplified planning plugin that provides a todo list tool for the agent.
 */
export function planning<TState extends PlanningState = PlanningState, TEvent = any>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  const {
    toolName = "plan",
    toolDescription = "Create or replace a todo list of tasks to achieve a goal.",
    updateToolName = "update_plan_step",
    updateToolDescription = "Update the status of a specific task in the current plan."
  } = options;

  const strategy =
    options.strategy ??
    (options.provider
      ? createDefaultPlannerStrategy<TState, TEvent>({
          provider: options.provider,
          ...(options.strategyOptions ?? {})
        })
      : undefined);

  const planCallEventType = `action:call:${toolName}`;
  const updateCallEventType = `action:call:${updateToolName}`;

  return (builder) => {
    const eventKey = (builder as any).config.eventKey || "type";

    // 1. Intercept to register tools and inject plan into instructions
    builder.intercept((event, context) => {
      const state = context.state as any;
      if (!state.actions) state.actions = [];

      // Add 'plan' tool
      if (!state.actions.some((a: any) => a.name === toolName)) {
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

      // Add 'update_plan_step' tool
      if (!state.actions.some((a: any) => a.name === updateToolName)) {
        state.actions.push({
          name: updateToolName,
          description: updateToolDescription,
          parameters: {
            type: "object",
            properties: {
              taskIndex: { type: "number", description: "The 0-based index of the task to update" },
              status: { 
                type: "string", 
                enum: ["pending", "in-progress", "completed"],
                description: "The new status of the task"
              }
            },
            required: ["taskIndex", "status"]
          }
        });
      }

      // Inject plan into instructions
      if (state.plan && state.agent) {
        const currentInstructions = state.agent.instructions;
        const plan = state.plan as Plan;
        
        // Use a wrapper function to ensure instructions are always up-to-date
        state.agent.instructions = async (ctx: RuntimeContext<TState, TEvent>) => {
          let baseInstructions = "";
          if (typeof currentInstructions === "function") {
            baseInstructions = await currentInstructions(ctx);
          } else if (typeof currentInstructions === "string") {
            baseInstructions = currentInstructions;
          }

          const planStr = plan.steps
            .map((s, i) => `${i}. [${s.status}] ${s.task}`)
            .join("\n");

          return `${baseInstructions}\n\n## CURRENT PLAN\nGoal: ${plan.goal}\n\nTasks:\n${planStr}\n\nUpdate your progress using '${updateToolName}' as you work through these tasks. If the plan needs to change, use '${toolName}' to create a new one.`;
        };
      }

      return event;
    });

    // 2. Handle 'plan' tool call
    builder.on(planCallEventType, async function* (event: any, context) {
      const goal = String(event.data.args?.goal ?? "").trim();
      const toolCallId = event.data.id;

      if (!goal) {
        yield {
          [eventKey]: "action:error",
          data: { action: toolName, toolCallId, error: "Goal is required for planning." }
        } as any;
        return;
      }

      if (!strategy) {
        yield {
          [eventKey]: "action:error",
          data: { action: toolName, toolCallId, error: "No planner strategy configured." }
        } as any;
        return;
      }

      // Create Plan
      yield { [eventKey]: PlanningEvents.Create, data: { goal } } as any;
      const created = await strategy.createPlan({ goal, input: event.data.args, context });
      
      const plan: Plan = {
        id: generateId(),
        goal,
        steps: toPlanSteps(created.steps),
        status: "active",
        metadata: created.metadata
      };
      context.state.plan = plan;

      // Return the result to the agent
      yield { 
        [eventKey]: "action:result", 
        data: { 
          action: toolName,
          toolCallId, 
          result: { 
            status: plan.status, 
            goal: plan.goal, 
            todos: plan.steps.map((s, i) => ({ index: i, task: s.task, status: s.status })) 
          } 
        } 
      } as any;
    });

    // 3. Handle 'update_plan_step' tool call
    builder.on(updateCallEventType, async function* (event: any, context) {
      const { taskIndex, status } = event.data.args;
      const toolCallId = event.data.id;
      const plan = context.state.plan as Plan | undefined;

      if (!plan) {
        yield {
          [eventKey]: "action:error",
          data: { action: updateToolName, toolCallId, error: "No active plan found." }
        } as any;
        return;
      }

      if (typeof taskIndex !== "number" || taskIndex < 0 || taskIndex >= plan.steps.length) {
        yield {
          [eventKey]: "action:error",
          data: { action: updateToolName, toolCallId, error: `Invalid task index: ${taskIndex}. Valid indices: 0-${plan.steps.length - 1}` }
        } as any;
        return;
      }

      // Update the step
      const step = plan.steps[taskIndex];
      const oldStatus = step.status;
      step.status = status;

      yield { 
        [eventKey]: PlanningEvents.UpdateStep, 
        data: { taskIndex, status, oldStatus, task: step.task } 
      } as any;

      // Check if all steps are completed
      const allCompleted = plan.steps.every(s => s.status === "completed");
      if (allCompleted && plan.status !== "completed") {
        plan.status = "completed";
        yield { [eventKey]: PlanningEvents.Complete, data: { result: plan.steps } } as any;
      } else if (!allCompleted && plan.status === "completed") {
        plan.status = "active";
      }

      yield { 
        [eventKey]: "action:result", 
        data: { 
          action: updateToolName,
          toolCallId, 
          result: { 
            message: `Task "${step.task}" status updated to ${status}`,
            planStatus: plan.status
          } 
        } 
      } as any;
    });
  };
}

export function planner<TState extends PlanningState = PlanningState, TEvent = any>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  return planning(options);
}
