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
      const pendingToolCalls: Array<{ id?: string; name: string; args: any }> = [];
      let assistantText = "";
      const stepIndex = (event as any).data?.step || 1;
      const messageId = `msg_${context.runId}_${stepIndex}`;

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
          const callId = providerEvent.callId || `tool_call_${context.runId}_${stepIndex}_${pendingToolCalls.length}`;

          // Emit the tool call event
          yield {
            type: AgentEvents.Action,
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
          yield { type: AgentEvents.Error, data: providerEvent.error } as any;
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

      // If no tool calls, this run reached a terminal assistant response.
      if (pendingToolCalls.length === 0) {
        yield {
          type: AgentEvents.Complete,
          data: { agent: (context.state as any)?.agent?.name ?? "Agent" }
        } as any;
        return;
      }

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
              type: AgentEvents.Result,
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
              type: AgentEvents.Error,
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

      // Signal that this step is finished and we might need another one
      yield { type: AgentEvents.StepNext, data: { step: stepIndex + 1 } } as any;
    });
  };
}
