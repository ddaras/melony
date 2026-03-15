# Runtime

Melony is built around a tiny runtime: a small event loop with shared run state.
Everything else (agents, actions, planning, memory, workflows) is layered on top of it.

## What the runtime does

At its core, the runtime has three jobs:

- Route events to matching handlers.
- Provide mutable run-scoped state.
- Let handlers emit follow-up events.

That is enough to model agent behavior without hidden control flow.

## Runtime contract

Each handler receives:

- `event`: `{ type: string, data: unknown }`
- `context.state`: mutable state for the current run
- `context.runId`: run identifier
- `context.emit(...)`: enqueue another event
- `context.suspend()`: stop execution immediately

## How a run executes

1. A run starts with an input event (often `agent:run`).
2. Interceptors run first and can observe or alter flow.
3. Matching handlers run for that event.
4. Handlers may call `emit`, which schedules more events.
5. The runtime drains emitted events until none remain, then finishes (or exits early on suspend/error).

## Shared event conventions

Plugins generally follow these event families:

- **Agent lifecycle**: `agent:run`, `agent:complete`
- **Actions/tools**: `action:call`, `action:result`, `action:error`
- **LLM output**: `llm:text:delta`, `llm:text`, `llm:error`
- **Workflow orchestration**: `workflow:*`

Common state keys include:

- `state.agent`
- `state.actions`
- `state.messages`

These are conventions, not strict schema guarantees.
