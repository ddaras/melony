import { MelonyPlugin, Event, RuntimeContext } from "melony";
import { streamText, LanguageModel } from "ai";
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
    messages: any[],
    context: RuntimeContext
  ): AsyncGenerator<Event, void, unknown> {

    const result = streamText({
      model,
      system,
      messages,
      tools: toolDefinitions,
    });

    for await (const delta of result.textStream) {
      yield {
        type: "assistant:text-delta",
        data: { delta },
      } as Event;
    }

    // Wait for tool calls to complete
    const toolCalls = await result.toolCalls;
    for (const call of toolCalls) {
      // Emit the event corresponding to the tool call
      yield {
        type: `${actionEventPrefix}${call.toolName}`,
        data: call.input,
      } as Event;
    }
  }

  // Handle user text input
  builder.on(promptInputType, async function* (event, context) {
    const content = event.data.content;
    yield* routeToLLM([{ role: "user", content }], context);
  });

  // feed action results back to the LLM
  builder.on(actionResultInputType, async function* (event, context) {
    const { action, result } = event.data as any;
    yield* routeToLLM([{ role: "user", content: `[System: Action "${action}" completed with result: ${JSON.stringify(result)}]` }], context);
  });
};
