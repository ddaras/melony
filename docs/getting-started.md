# Getting Started with Melony

Melony is a tiny runtime for event-driven agents: **event in -> handlers run -> events out**.

## 1) Install

```bash
pnpm add melony
```

## 2) Tiny runtime in 60 seconds

```ts
import { Event, melony } from "melony";

// Event types flowing through the runtime
type UserTextEvent = Event<{ content: string }> & { type: "user:text" };
type AssistantTextEvent = Event<{ content: string }> & { type: "assistant:text" };
type ChatEvent = UserTextEvent | AssistantTextEvent;

// Shared state for this run
type ChatState = {
  turns: number;
  lastUserMessage?: string;
};

// Build a typed app: state + events
const app = melony<ChatState, ChatEvent>()
  .on("user:text", async function* (event, { state }) {
    // Simple state update example
    state.turns += 1;
    state.lastUserMessage = event.data.content;

    yield {
      type: "assistant:text",
      data: { content: `Echo (${state.turns}): ${event.data.content}` },
    };
  });

// Run once with an initial typed state value
for await (const event of app.build().run({
  type: "user:text",
  data: { content: "Hello" },
}, {
  state: { turns: 0 },
})) {
  console.log("out:", event.type, event.data);
}
```

That is the whole idea:
- `.on(type, handler)` reacts to events.
- Handlers `yield` next events.
- `.build().run(event)` executes one run and streams events.

## 3) HTTP helpers (optional)

If you are in a route handler:
- `app.streamResponse(event)` -> stream events as an HTTP response.
- `app.jsonResponse(event)` -> return all emitted events as JSON.

## Next steps by package

### Core Plugins

- Agents: [`@melony/agents`](/docs/packages/melony-agents)
- Actions/tools: [`@melony/actions`](/docs/packages/melony-actions)
- Planning: [`@melony/planning`](/docs/packages/melony-planning)
- Workflows/orchestration: [`@melony/workflows`](/docs/packages/melony-workflows)
- Memory: [`@melony/memory`](/docs/packages/melony-memory)

### UI & Frameworks

- React integration: [`@melony/react`](/docs/packages/melony-react)

### LLM Providers

- LLM abstraction: [`@melony/llm`](/docs/packages/melony-llm)
- OpenAI provider: [`@melony/openai`](/docs/packages/melony-openai)
- Gemini provider: [`@melony/gemini`](/docs/packages/melony-gemini)

## Core concepts

- [Runtime](/docs/concepts/runtime)
