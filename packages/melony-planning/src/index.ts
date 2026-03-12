import { AgentPlugin, AgentEvents } from "@melony/agents";
import { generateId, Event, RuntimeContext } from "melony";
import { 
  PlanningState, 
  PlanningEvents, 
  Plan, 
  PlanStep, 
  PlannerOptions 
} from "./types";

export * from "./types";

/**
 * Core planning plugin for Melony.
 * Manages the state and lifecycle of plans.
 */
export function planning<TState extends PlanningState = PlanningState, TEvent extends Event = Event>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  const { maxAttemptsPerStep = 3 } = options;

  return (builder) => {
    // Handle initial plan creation
    builder.on(PlanningEvents.Create, async function* (event: any, context) {
      const goal = event.data.goal;
      const plan: Plan = {
        id: generateId(),
        goal,
        steps: [],
        cursor: 0,
        status: "active",
      };

      context.state.plan = plan;
      yield { type: PlanningEvents.Created, data: plan } as any;
    });

    // Handle step results to advance the cursor or trigger failures
    builder.on(PlanningEvents.StepResult, async function* (event: any, context) {
      const { stepId, result, error } = event.data;
      const plan = context.state.plan;
      if (!plan) return;

      const stepIndex = plan.steps.findIndex(s => s.id === stepId);
      if (stepIndex === -1) return;

      const step = plan.steps[stepIndex];
      if (error) {
        step.attempts++;
        if (step.attempts >= maxAttemptsPerStep) {
          step.status = "failed";
          plan.status = "failed";
          yield { type: PlanningEvents.Failed, data: { error: `Step failed after ${step.attempts} attempts: ${error}` } } as any;
        } else {
          // Re-trigger the step
          yield { type: PlanningEvents.StepStart, data: { stepId } } as any;
        }
      } else {
        step.status = "completed";
        step.result = result;
        
        // Move to next step if any
        if (plan.cursor === stepIndex) {
          plan.cursor++;
        }

        if (plan.cursor >= plan.steps.length) {
          plan.status = "completed";
          yield { type: PlanningEvents.Complete, data: { result: plan.steps.map(s => s.result) } } as any;
        } else {
          const nextStep = plan.steps[plan.cursor];
          yield { type: PlanningEvents.StepStart, data: { stepId: nextStep.id } } as any;
        }
      }
    });
  };
}

/**
 * A ReAct-style planner that uses an LLM to generate plan steps.
 */
export function reactPlanner<TState extends PlanningState = PlanningState, TEvent extends Event = Event>(
  options: PlannerOptions<TState, TEvent> = {}
): AgentPlugin<TState, TEvent> {
  return (builder) => {
    builder.use(planning(options));

    // Intercept agent:run to auto-trigger planning
    builder.on(AgentEvents.Run, async function* (event: any, context) {
      if (!context.state.plan && event.data) {
        yield { type: PlanningEvents.Create, data: { goal: event.data } } as any;
      }
    });

    // Initial plan population
    builder.on(PlanningEvents.Created, async function* (event: any, context) {
      yield { type: PlanningEvents.Replan, data: { reason: "Initial planning" } } as any;
    });

    // LLM-driven planning (replan)
    builder.on(PlanningEvents.Replan, async function* (event: any, context) {
      const plan = context.state.plan;
      if (!plan) return;

      yield { type: "llm:text:delta", data: { text: `Creating plan for: ${plan.goal}...\n` } } as any;
      
      // In a real implementation, you'd call an LLM provider here to generate steps
      // For now, we'll simulate the plan generation
      const mockSteps: PlanStep[] = [
        { id: generateId(), goal: "Analyze the objective", status: "pending", attempts: 0 },
        { id: generateId(), goal: "Execute required actions", status: "pending", attempts: 0 },
        { id: generateId(), goal: "Finalize and verify result", status: "pending", attempts: 0 },
      ];

      plan.steps = mockSteps;
      plan.cursor = 0;
      plan.status = "active";

      yield { type: "llm:text", data: { text: `Plan finalized with ${mockSteps.length} steps.` } } as any;
      yield { type: PlanningEvents.StepStart, data: { stepId: mockSteps[0].id } } as any;
    });

    // LLM-driven step execution
    builder.on(PlanningEvents.StepStart, async function* (event: any, context) {
      const { stepId } = event.data;
      const plan = context.state.plan;
      if (!plan) return;

      const step = plan.steps.find(s => s.id === stepId);
      if (!step) return;

      step.status = "running";
      yield { type: "llm:text:delta", data: { text: `[Step ${plan.steps.indexOf(step) + 1}/${plan.steps.length}] ${step.goal}\n` } } as any;

      // This would normally trigger an LLM tool call if tools were needed
      // For this implementation, we'll just yield a successful result
      yield { type: PlanningEvents.StepResult, data: { stepId, result: `Success: ${step.goal}` } } as any;
    });
  };
}
