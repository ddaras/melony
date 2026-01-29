import { MelonyPlugin, Event, RuntimeContext } from "melony";
import { streamText, LanguageModel, ModelMessage } from "ai";
import { z } from "zod";

export interface AISDKPluginOptions {
  model: LanguageModel;
  system?: string;
  /**
   * Optional mapping of tool names to their descriptions and schemas.
   * Tool calls will emit events with the same name.
   */
  toolDefinitions?: Record<string, {
    description: string;
    inputSchema: z.ZodType<any>;
  }>;
  actionEventPrefix?: string;
  promptInputType?: string,
  actionResultInputType?: string,
}

/**
 * AI SDK Plugin for Melony.
 * Automatically handles text events and routes them through an LLM using Vercel AI SDK.
 * It can also automatically trigger events based on tool calls.
 */
export const aiSDKPlugin = (options: AISDKPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { model, system, toolDefinitions = {}, actionEventPrefix = "action:", promptInputType = "user:text", actionResultInputType = "action:result" } = options;

  async function* routeToLLM(
    newMessages: any[],
    context: RuntimeContext
  ): AsyncGenerator<Event, void, unknown> {
    const state = context.state as any;
    if (!state.messages) {
      state.messages = [];
    }

    // Add new messages to history
    state.messages.push(...newMessages);

    const result = streamText({
      model,
      system,
      messages: state.messages.slice(-10), // it causes tool issues as the tool result can match its call id
      tools: toolDefinitions,
    });

    let assistantText = "";
    for await (const delta of result.textStream) {
      assistantText += delta;
      yield {
        type: "assistant:text-delta",
        data: { delta },
      } as Event;
    }

    // Wait for tool calls to complete
    const toolCalls = await result.toolCalls;

    if (assistantText || toolCalls.length > 0) {
      const content: any[] = [];
      if (assistantText) {
        content.push({ type: "text", text: assistantText });
      }
      if (toolCalls.length > 0) {
        content.push(...toolCalls.map(call => ({
          type: "tool-call",
          toolCallId: call.toolCallId,
          toolName: call.toolName,
          input: call.input,
        })));
      }

      state.messages.push({
        role: "assistant",
        content: content.length === 1 && content[0].type === "text" ? assistantText : content,
      });
    }

    for (const call of toolCalls) {
      yield {
        type: `${actionEventPrefix}${call.toolName}`,
        data: {
          ...call.input,
          toolCallId: call.toolCallId,
        },
      } as Event;
    }

    const usage = await result.usage;
  }

  // Handle user text input
  builder.on(promptInputType, async function* (event, context) {
    const content = event.data.content;
    yield* routeToLLM([{ role: "user", content }], context);
  });

  // feed action results back to the LLM
  builder.on(actionResultInputType, async function* (event, context) {
    const { action, result, toolCallId } = event.data as any;

    const resultMessage = toolCallId
      ? {
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId,
            toolName: action,
            output: {
              type: "json",
              value: result,
            },
          },
        ],
      }
      : { role: "system", content: `[System: Action "${action}" completed with result: ${JSON.stringify(result)}]` };

    yield* routeToLLM([resultMessage], context);
  });
};
