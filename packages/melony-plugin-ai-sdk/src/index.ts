import { MelonyPlugin, Event, RuntimeContext } from "melony";
import { streamText, LanguageModel } from "ai";
import { z } from "zod";

interface SimpleMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Builds a simple history summary from recent messages.
 * Keeps the last N messages as simple role/content pairs.
 */
function getRecentHistory(messages: SimpleMessage[], maxMessages: number): SimpleMessage[] {
  return messages.slice(-maxMessages);
}

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
    newMessage: SimpleMessage,
    context: RuntimeContext
  ): AsyncGenerator<Event, void, unknown> {
    const state = context.state as any;
    if (!state.messages) {
      state.messages = [] as SimpleMessage[];
    }

    // Add new message to history
    state.messages.push(newMessage);

    const result = streamText({
      model,
      system,
      messages: getRecentHistory(state.messages, 20),
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

    // Store assistant response as simple text
    if (assistantText) {
      state.messages.push({
        role: "assistant",
        content: assistantText,
      });
    }

    // Emit tool call events
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

    yield {
      type: "ui",
      data: {
        type: 'text',
        props: {
          value: `Usage: ${usage.totalTokens} tokens`,
        }
      },
    } as Event;
  }

  // Handle user text input
  builder.on(promptInputType, async function* (event, context) {
    const content = event.data.content;
    yield* routeToLLM({ role: "user", content }, context);
  });

  // Feed action results back to the LLM as system messages
  builder.on(actionResultInputType, async function* (event, context) {
    const { action, result } = event.data as any;
    const summary = typeof result === "string" ? result : JSON.stringify(result);
    yield* routeToLLM({ role: "system", content: `Action "${action}" completed: ${summary}` }, context);
  });
};
