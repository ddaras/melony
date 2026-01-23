import { MelonyPlugin, Event, RuntimeContext } from "melony";
import { streamText, tool, LanguageModel, Tool } from "ai";
import { z } from "zod";

export interface AISDKPluginOptions {
  model: LanguageModel;
  system?: string;
  /**
   * Optional mapping of action names to their tool descriptions and schemas.
   */
  tools?: Record<string, {
    description: string;
    schema: z.ZodType<any>;
  }>;
}

/**
 * AI SDK Plugin for Melony.
 * Automatically handles text events and routes them through an LLM using Vercel AI SDK.
 * It can also automatically trigger actions based on tool calls.
 */
export const aiSDKPlugin = (options: AISDKPluginOptions): MelonyPlugin<any, any> => (builder) => {
  const { model, system, tools: toolConfigs = {} } = options;

  async function* routeToLLM(
    messages: any[],
    context: RuntimeContext
  ): AsyncGenerator<Event, void, unknown> {
    const { actions } = context;

    // Build tools for the AI SDK
    const aiTools: Record<string, any> = {};

    for (const [name, action] of Object.entries(actions)) {
      const config = toolConfigs[name];

      // We only expose actions that have tool configurations
      if (config) {
        // Use the tool helper from 'ai' to ensure correct schema transformation.
        // We use 'any' cast for 'tool' to avoid complex type issues with 'execute'
        // during build, as we don't actually use 'execute' for the run.
        aiTools[name] = tool({
          description: config.description,
          inputSchema: config.schema,
          execute: async () => {
            return { __melony_placeholder: true };
          }
        });
      }
    }

    const result = streamText({
      model,
      system,
      messages,
      tools: aiTools,
    });

    for await (const delta of result.textStream) {
      yield {
        type: "text-delta",
        data: { delta },
      } as Event;
    }

    // Wait for tool calls to complete
    const toolCalls = await result.toolCalls;
    for (const call of toolCalls) {
      yield {
        type: "call-action",
        data: {
          action: call.toolName,
          params: (call as any).args || (call as any).input,
        },
      } as Event;
    }
  }

  // Handle user text input
  builder.on("text", async function* (event, context) {
    if (event.meta?.role === "user") {
      const content = (event.data as any)?.content || (event.data as any)?.text || "";
      yield* routeToLLM([{ role: "user", content }], context);
    }
  });

  // Handle follow-up after an action completes
  builder.on("action:after", async function* (event, context) {
    const { action, result } = event.data as any;

    const messages: any[] = [
      {
        role: "user",
        content: `[System: Action "${action}" completed with result: ${JSON.stringify(result)}]`,
      },
    ];

    yield* routeToLLM(messages, context);
  });
};
