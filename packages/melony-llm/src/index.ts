import { AgentEvents, AgentPlugin, AgentState, Instructions, resolveInstructions } from "@melony/agents";
import { LlmPluginOptions, LlmMessage, LlmTool } from "./types";
import { RuntimeContext } from "melony";

export * from "./types";

function toToolMessageContent(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * A stateless LLM plugin that generates a response for the current state.
 * Responds to `agent:step` events.
 */
export function llm<TState extends AgentState = AgentState, TEvent = any>(
  options: LlmPluginOptions<TState, TEvent>
): AgentPlugin<TState, TEvent> {
  return (builder) => {
    builder.on(AgentEvents.Step, async function* (event, context) {
      const system = await resolveInstructions(context);

      const messageSelector = options.messageSelector || ((ctx: RuntimeContext<TState, TEvent>) => (ctx.state as any).messages || []);
      const toolSelector =
        options.toolSelector ||
        ((ctx: RuntimeContext<TState, TEvent>) =>
          (ctx.state as any).actions || (ctx.state as any).capabilities?.actions || []);

      let messages = messageSelector(context);
      const tools = toolSelector(context);
      let assistantText = "";
      const stepIndex = (event as any).data?.step || 1;
      const messageId = `msg_${context.runId}_${stepIndex}`;
      let actionCount = 0;

      for await (const providerEvent of options.provider.generate({
        system,
        messages,
        tools,
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
        context
      })) {
        if (providerEvent.type === "text:delta") {
          if (typeof providerEvent.text === "string") {
            assistantText += providerEvent.text;
          }
          yield {
            type: AgentEvents.Thought,
            data: { delta: providerEvent.text, messageId },
            meta: { volatile: true }
          } as any;
        } else if (providerEvent.type === "text:done") {
          if (typeof providerEvent.text === "string" && providerEvent.text.length > 0) {
            assistantText = providerEvent.text;
          }
          yield {
            type: AgentEvents.Thought,
            data: { text: providerEvent.text, messageId }
          } as any;
        } else if (providerEvent.type === "tool:call") {
          if (!providerEvent.name) {
            yield {
              type: AgentEvents.Error,
              data: { message: "Provider emitted tool:call without a name." }
            } as any;
            continue;
          }
          const callId = providerEvent.callId || `tool_call_${context.runId}_${stepIndex}_${actionCount++}`;

          // Emit the tool call event
          yield {
            type: AgentEvents.Action,
            data: {
              id: callId,
              name: providerEvent.name,
              input: providerEvent.input
            }
          } as any;
        } else if (providerEvent.type === "error") {
          yield { type: AgentEvents.Error, data: providerEvent.error } as any;
        }
      }
    });
  };
}
