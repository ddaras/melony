# Melony Runtime

The Melony Runtime is the execution engine at the center of the framework.

It does one job well: process typed events through a set of handlers and stream every emitted event as execution unfolds. That simplicity is intentional. The runtime is small enough to stay understandable, but expressive enough to power agents, tools, workflows, and interactive products.

## The runtime in one sentence

**An event comes in, matching handlers run, and yielded events continue the execution.**

That is the full model. There is no hidden planner, scheduler, or control loop inside the core runtime.

## What the runtime is responsible for

- Routing an event to handlers that match its `type`
- Running interceptors before handlers
- Providing mutable state scoped to a single run
- Streaming the input event and all follow-up events in order
- Allowing execution to stop early through `suspend()`

Everything else in the ecosystem builds on top of those guarantees.

## Runtime contract

Each handler receives:

- `event`: the current event being processed
- `context.state`: mutable state for the current run
- `context.runId`: the current run identifier
- `context.runtime`: the runtime instance
- `context.suspend(event?)`: stop execution immediately, optionally by emitting a final event

Handlers do not call `emit()` directly. Instead, they `yield` events from the handler itself:

```ts
import { Event, melony } from "melony";

type AppEvent =
  | (Event & { type: "user:text"; data: { content: string } })
  | (Event & { type: "assistant:text"; data: { content: string } });

const app = melony<unknown, AppEvent>()
  .on("user:text", async function* (event) {
    yield {
      type: "assistant:text",
      data: { content: `Echo: ${event.data.content}` },
    };
  });
```

## How a run executes

When you call `runtime.run(initialEvent, options)`, Melony executes a run with this lifecycle:

1. A `runId` is created or reused from `options`.
2. Run-scoped `state` is created from `options.state`.
3. Interceptors run for the current event and may replace it or suspend execution.
4. The current event is emitted into the output stream.
5. Matching `*` handlers and type-specific handlers run.
6. Any event yielded by a handler is processed recursively through the same lifecycle.
7. Execution ends when there are no more yielded events, or immediately if execution is suspended or an error is raised.

This gives you a deterministic, inspectable execution trace from the first input to the last emitted event.

## Interceptors vs handlers

Use the two extension points differently:

- Use **interceptors** for cross-cutting concerns such as logging, validation, tracing, or policy checks.
- Use **handlers** for business logic that reacts to specific event types and yields follow-up events.

```ts
import { Event, melony } from "melony";

type AppEvent =
  | (Event & { type: "user:text"; data: { content: string } })
  | (Event & { type: "assistant:text"; data: { content: string } });

const app = melony<unknown, AppEvent>()
  .intercept((event, { runId }) => {
    console.log(`[${runId}] incoming:`, event.type);
    return event;
  })
  .on("user:text", async function* (event) {
    yield {
      type: "assistant:text",
      data: { content: `Handled: ${event.data.content}` },
    };
  });
```

## Packaging runtime behavior with plugins

Melony plugins are just functions that receive the builder and register behavior. This keeps reuse simple and transparent.

```ts
import { Event, MelonyPlugin, melony } from "melony";

type AppEvent =
  | (Event & { type: "user:text"; data: { content: string } })
  | (Event & { type: "assistant:text"; data: { content: string } });

const loggingPlugin: MelonyPlugin<unknown, AppEvent> = (builder) => {
  builder.intercept((event) => {
    console.log("[plugin]", event.type);
    return event;
  });
};

const app = melony<unknown, AppEvent>()
  .use(loggingPlugin)
  .on("user:text", async function* (event) {
    yield {
      type: "assistant:text",
      data: { content: `Echo: ${event.data.content}` },
    };
  });
```

## Why this model works well for agents

Agent systems usually need the same three things:

- explicit execution
- observable intermediate steps
- flexible composition across tools, models, and UI

The runtime gives you that without forcing agent-specific abstractions into the core. A tool call can be an event. A planning step can be an event. A human approval gate can be an interceptor or a yielded event. The runtime stays small, while the behaviors layered on top can grow as sophisticated as you need.

## Common event conventions

Many Melony packages use event families such as:

- `agent:*` for agent lifecycle
- `action:*` for tool execution
- `llm:*` for model streaming and completion
- `workflow:*` for orchestration

These are conventions from higher-level packages, not rules enforced by the runtime itself.
