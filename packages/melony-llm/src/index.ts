import { AgentEvents, AgentPlugin, AgentState, Instructions } from "@melony/agents";
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

async function resolveInstructions(context: RuntimeContext<any, any>): Promise<string | undefined> {
  const state = context.state as AgentState;
  const instructions = state.agent?.instructions;
  if (typeof instructions === "function") {
    return await instructions(context);
  }
  return instructions;
}

export function llm<TState extends AgentState = AgentState, TEvent = any>(
  options: LlmPluginOptions<TState, TEvent>
): AgentPlugin<TState, TEvent> {
  return (builder) => {
    builder.on(AgentEvents.Run, async function* (event, context) {
      const system = await resolveInstructions(context);

      const messageSelector = options.messageSelector || ((ctx: RuntimeContext<TState, TEvent>) => (ctx.state as any).messages || []);
      const toolSelector =
        options.toolSelector ||
        ((ctx: RuntimeContext<TState, TEvent>) =>
          (ctx.state as any).actions || (ctx.state as any).capabilities?.actions || []);

      let messages = messageSelector(context);
      let steps = 0;
      const maxSteps = options.maxSteps || 6;

      while (steps < maxSteps) {
        steps++;
        const tools = toolSelector(context);
        const pendingToolCalls: Array<{ id?: string; name: string; args: any }> = [];
        let assistantText = "";

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
            yield { type: "llm:text:delta", data: { delta: providerEvent.text }, meta: { volatile: true } } as any;
          } else if (providerEvent.type === "text:done") {
            if (typeof providerEvent.text === "string" && providerEvent.text.length > 0) {
              assistantText = providerEvent.text;
            }
            yield { type: "llm:text", data: { text: providerEvent.text } } as any;
          } else if (providerEvent.type === "tool:call") {
            if (!providerEvent.name) {
              yield {
                type: "llm:error",
                data: { message: "Provider emitted tool:call without a name." }
              } as any;
              continue;
            }
            const callId = providerEvent.callId || `tool_call_${context.runId}_${steps}_${pendingToolCalls.length}`;
            
            // Emit the tool call event
            yield {
              type: "llm:tool:call",
              data: {
                id: callId,
                name: providerEvent.name,
                input: providerEvent.input
              }
            } as any;
            
            pendingToolCalls.push({
              id: callId,
              name: providerEvent.name,
              args: providerEvent.input
            });
          } else if (providerEvent.type === "error") {
            yield { type: "llm:error", data: providerEvent.error } as any;
          }
        }

        if (pendingToolCalls.length > 0) {
          messages.push({
            role: "assistant",
            content: assistantText,
            toolCalls: pendingToolCalls.map((toolCall) => ({
              id: toolCall.id!,
              name: toolCall.name,
              input: toolCall.args
            }))
          });
        } else if (assistantText.trim().length > 0) {
          messages.push({ role: "assistant", content: assistantText });
        }

        if (pendingToolCalls.length === 0) break;

        for (const toolCall of pendingToolCalls) {
          let sawResult = false;

          for await (const actionEvent of context.runtime.run(
            {
              type: `action:call:${toolCall.name}`,
              data: {
                id: toolCall.id,
                name: toolCall.name,
                args: toolCall.args
              }
            } as any,
            { state: context.state, runId: context.runId }
          )) {
            const eventData = (actionEvent as any)?.data;
            const eventToolCallId = eventData?.toolCallId;
            const matchesToolCall =
              toolCall.id == null || eventToolCallId == null || eventToolCallId === toolCall.id;

            if ((actionEvent as any).type === "action:result" && matchesToolCall) {
              sawResult = true;
              yield {
                type: "llm:tool:result",
                data: {
                  id: toolCall.id,
                  name: toolCall.name,
                  result: eventData?.result
                }
              } as any;
              messages.push({
                role: "tool",
                name: toolCall.name,
                toolCallId: toolCall.id,
                content: toToolMessageContent(eventData?.result)
              });
            } else if ((actionEvent as any).type === "action:error" && matchesToolCall) {
              sawResult = true;
              yield {
                type: "llm:tool:error",
                data: {
                  id: toolCall.id,
                  name: toolCall.name,
                  error: eventData?.error ?? "Unknown action error"
                }
              } as any;
              messages.push({
                role: "tool",
                name: toolCall.name,
                toolCallId: toolCall.id,
                content: toToolMessageContent({ error: eventData?.error ?? "Unknown action error" })
              });
            }
          }

          if (!sawResult) {
            messages.push({
              role: "tool",
              name: toolCall.name,
              toolCallId: toolCall.id,
              content: toToolMessageContent({ error: `Action "${toolCall.name}" produced no result event.` })
            });
          }
        }
      }
    });
  };
}
