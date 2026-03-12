import { AgentEvents, AgentPlugin, AgentState, Instructions } from "@melony/agents";
import { LlmPluginOptions, LlmMessage, LlmTool } from "./types";
import { RuntimeContext, Event } from "melony";

export * from "./types";

async function resolveInstructions(context: RuntimeContext<any, any>): Promise<string | undefined> {
  const state = context.state as AgentState;
  const instructions = state.agent?.instructions;
  if (typeof instructions === "function") {
    return await instructions(context);
  }
  return instructions;
}

export function llm<TState extends AgentState = AgentState, TEvent extends Event = Event>(
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
        let hasToolCall = false;

        for await (const providerEvent of options.provider.generate({
          system,
          messages,
          tools,
          temperature: options.temperature,
          maxOutputTokens: options.maxOutputTokens,
          context
        })) {
          if (providerEvent.type === "text:delta") {
            yield { type: "llm:text:delta", data: { text: providerEvent.text } } as any;
          } else if (providerEvent.type === "text:done") {
            yield { type: "llm:text", data: { text: providerEvent.text } } as any;
          } else if (providerEvent.type === "tool:call") {
            hasToolCall = true;
            yield {
              type: "action:call",
              data: {
                id: providerEvent.callId,
                name: providerEvent.name,
                args: providerEvent.input
              }
            } as any;
          } else if (providerEvent.type === "error") {
            yield { type: "llm:error", data: providerEvent.error } as any;
          }
        }

        if (!hasToolCall) break;

        // In a real implementation, we would wait for action:result and update messages
        // For now, this is the architectural skeleton
        break;
      }
    });
  };
}
