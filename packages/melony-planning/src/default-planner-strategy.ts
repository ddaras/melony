import { RuntimeContext } from "melony";
import { LlmProviderEvent, LlmTool } from "@melony/llm";
import {
  DefaultPlannerStrategyOptions,
  PlannerStrategy,
  PlanningState
} from "./types";

const DEFAULT_SYSTEM_PROMPT = `You are a todo list writer. Create a list of clear, actionable tasks to achieve the goal.
Return only JSON with this shape:
{ "steps": [{ "task": "string" }] }`;
const MAX_ACTIONS_IN_CONTEXT = 30;
const MAX_TEXT_LENGTH = 200;

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

function shorten(value: unknown, max = MAX_TEXT_LENGTH): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "Unknown";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function buildPlannerContext<TState extends PlanningState, TEvent = any>(
  context: RuntimeContext<TState, TEvent>
): string {
  const state = context.state as any;
  const agent = state?.agent;
  const actions = Array.isArray(state?.actions) ? state.actions : [];

  const agentName = shorten(agent?.name);
  const agentDescription = shorten(agent?.description);
  const actionLines = actions
    .slice(0, MAX_ACTIONS_IN_CONTEXT)
    .map((action: any) => `- ${shorten(action?.name)}: ${shorten(action?.description)}`);

  const actionsBlock = actionLines.length > 0 ? actionLines.join("\n") : "- None";

  return `Agent:
- Name: ${agentName}
- Description: ${agentDescription}

Available Actions:
${actionsBlock}`;
}

export function createDefaultPlannerStrategy<
  TState extends PlanningState = PlanningState,
  TEvent = any
>(options: DefaultPlannerStrategyOptions<TState, TEvent>): PlannerStrategy<TState, TEvent> {
  const { provider, maxPlanSteps = 10, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;

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
      const plannerContext = buildPlannerContext(context);
      const prompt = `${plannerContext}

Goal: ${goal}
Input: ${JSON.stringify(input)}`;
      return generatePlan(prompt, context);
    }
  };
}
