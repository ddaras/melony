import { Event, RuntimeContext } from "melony";
import { LlmProviderEvent, LlmTool } from "@melony/llm";
import {
  DefaultPlannerStrategyOptions,
  Plan,
  PlannerStrategy,
  PlanningState
} from "./types";

const DEFAULT_SYSTEM_PROMPT = `You are a planning engine. Return only JSON with this shape:
{ "steps": [{ "goal": "string", "action": { "type": "string", "data": {} } }] }`;

function extractJson(raw: string): any {
  const match = raw.match(/\{[\s\S]*\}/) || raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

async function collectText(events: AsyncGenerator<LlmProviderEvent>): Promise<string> {
  let text = "";
  for await (const e of events) {
    if (e.type === "text:delta" && typeof e.text === "string") text += e.text;
    else if (e.type === "text:done" && typeof e.text === "string") text = e.text;
    else if (e.type === "error") throw e.error;
  }
  return text;
}

export function createDefaultPlannerStrategy<
  TState extends PlanningState = PlanningState,
  TEvent extends Event = Event
>(options: DefaultPlannerStrategyOptions<TState, TEvent>): PlannerStrategy<TState, TEvent> {
  const { provider, maxPlanSteps = 8, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

  const toolSelector = options.toolSelector ?? ((context) => (context.state as any).actions ?? []);

  const generatePlan = async (prompt: string, context: RuntimeContext<TState, TEvent>) => {
    const rawText = await collectText(provider.generate({
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      context
    }));
    const parsed = extractJson(rawText);
    const steps = (Array.isArray(parsed) ? parsed : parsed.steps) || [];
    return { steps: steps.slice(0, maxPlanSteps) };
  };

  return {
    createPlan: ({ goal, input, context }) => {
      const tools = toolSelector(context).map((t: LlmTool) => `${t.name}: ${t.description}`).join("\n");
      return generatePlan(`Goal: ${goal}\nInput: ${JSON.stringify(input)}\nAvailable tools:\n${tools}`, context);
    },
    replan: ({ plan, reason, context }) => {
      return generatePlan(`Original Goal: ${plan.goal}\nReplan Reason: ${reason}\nCurrent Plan: ${JSON.stringify(plan.steps)}`, context);
    }
  };
}
