import { AgentPlugin, AgentState, AgentEvents } from "./types.js";

/**
 * A built-in plugin that manages conversation history in state.messages.
 * It listens for core agent events and updates the state accordingly.
 */
export function memoryPlugin<
  TState extends AgentState = AgentState,
  TEvent = any
>(): AgentPlugin<TState, TEvent> {
  return (builder) => {
    // 1. User Intent
    builder.on(AgentEvents.UserIntent, async function* (event: any, context) {
      const text = event?.data?.text;
      if (typeof text !== "string" || text.trim() === "") return;

      const state = context.state as any;
      state.messages ??= [];
      state.messages.push({ role: "user", content: text });

      yield { type: AgentEvents.Run, data: { text } } as any;
    });

    // 2. Assistant Thoughts (Persistent/Terminal)
    builder.on(AgentEvents.Thought, async function* (event: any, context) {
      const text = event?.data?.text;
      if (typeof text !== "string") return;

      const state = context.state as any;
      state.messages ??= [];

      // If we have an existing assistant message from this run (e.g. via Action), update it.
      // Otherwise, push a new one.
      const lastMsg = state.messages[state.messages.length - 1];
      if (lastMsg?.role === "assistant" && !lastMsg.content) {
        lastMsg.content = text;
      } else {
        state.messages.push({
          role: "assistant",
          content: text,
        });
      }
    });

    // 2. Assistant Actions (Tool Calls)
    builder.on(AgentEvents.Action, async function* (event: any, context) {
      const { id, name, input } = event?.data || {};
      if (!name) return;

      const state = context.state as any;
      state.messages ??= [];

      let lastMsg = state.messages[state.messages.length - 1];
      if (lastMsg?.role !== "assistant") {
        lastMsg = { role: "assistant", content: "", toolCalls: [] };
        state.messages.push(lastMsg);
      }

      lastMsg.toolCalls ??= [];
      lastMsg.toolCalls.push({
        id,
        name,
        input,
      });
    });

    // 3. Action Results
    builder.on(AgentEvents.Result, async function* (event: any, context) {
      const { id, name, result } = event?.data || {};
      if (!name) return;

      const state = context.state as any;
      state.messages ??= [];

      state.messages.push({
        role: "tool",
        name,
        toolCallId: id,
        content: typeof result === "string" ? result : JSON.stringify(result ?? null),
      });
    });

    // 4. Action Errors (as tool messages)
    builder.on(AgentEvents.Error, async function* (event: any, context) {
      const { id, name, error } = event?.data || {};
      // Only handle errors that look like tool results
      if (!name || !id) return;

      const state = context.state as any;
      state.messages ??= [];

      state.messages.push({
        role: "tool",
        name,
        toolCallId: id,
        content: JSON.stringify({ error: error ?? "Unknown error" }),
      });
    });
  };
}
