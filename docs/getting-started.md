# Quick Start

This guide shows the core Melony mental model in one small example:

1. Define your event types.
2. Register handlers for the events you care about.
3. Run the runtime with an initial event.
4. Consume the emitted event stream.

If you understand that loop, the rest of Melony will feel predictable.

## Install

```bash
pnpm add melony
```

## Build a minimal runtime

```ts
import { melony } from "melony";

type UserTextEvent = { type: "user:text"; data: { content: string } };
type AssistantTextEvent = { type: "assistant:text"; data: { content: string } };
type ChatEvent = UserTextEvent | AssistantTextEvent;

type ChatState = {
  turns: number;
  lastUserMessage?: string;
};

const app = melony<ChatState, ChatEvent>()
  .on("user:text", async function* (event, { state }) {
    state.turns += 1;
    state.lastUserMessage = event.data.content;

    yield {
      type: "assistant:text",
      data: { content: `Echo (${state.turns}): ${event.data.content}` },
    };
  });

const runtime = app.build();

for await (const event of runtime.run(
  {
    type: "user:text",
    data: { content: "Hello" },
  },
  {
    state: { turns: 0 },
  },
)) {
  console.log(event.type, event.data);
}
```

## What this example does

- `melony<ChatState, ChatEvent>()` creates a typed builder for one runtime.
- `.on("user:text", handler)` registers logic for a specific event type.
- The handler updates run-scoped state and `yield`s the next event.
- `runtime.run(...)` starts a run and returns an async stream of emitted events.

One important detail: Melony emits the incoming event as part of the stream before any follow-up events. That makes the full execution trace observable from the first input onward.

## Add cross-cutting logic with interceptors

Use interceptors for logic that should run before handlers, such as logging, validation, or guardrails.

```ts
const app = melony<ChatState, ChatEvent>()
  .intercept((event, { runId }) => {
    console.log(`[${runId}] event received`);
    return event;
  })
  .on("user:text", async function* (event, { state }) {
    state.turns += 1;

    yield {
      type: "assistant:text",
      data: { content: `Turn ${state.turns}: ${event.data.content}` },
    };
  });
```

## Return HTTP responses

If you are handling requests in a server route, the builder includes response helpers:

- `app.streamResponse(event, options)` streams events as an HTTP response.
- `app.jsonResponse(event, options)` returns the collected event list as JSON.

That lets you keep the same runtime model in local scripts, APIs, and UI-facing endpoints.

## Where to go next

- Read [Melony Runtime](/docs/concepts/runtime) for the execution model and lifecycle.
- Read [Melony Harness](/docs/concepts/harness) for the package architecture.
- Start with [`@melony/agents`](/docs/packages/melony-agents) if you want higher-level agent primitives.
- Add [`@melony/actions`](/docs/packages/melony-actions), [`@melony/planning`](/docs/packages/melony-planning), [`@melony/workflows`](/docs/packages/melony-workflows), or [`@melony/memory`](/docs/packages/melony-memory) as your system grows.
- Use [`@melony/llm`](/docs/packages/melony-llm) plus providers such as [`@melony/openai`](/docs/packages/melony-openai) or [`@melony/gemini`](/docs/packages/melony-gemini) when you need model integration.
- Use [`@melony/react`](/docs/packages/melony-react) when you want to connect a React UI to the event stream.
