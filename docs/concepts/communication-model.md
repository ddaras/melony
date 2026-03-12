# Communication Model

Melony uses a shared model across packages:

- **Events** are the communication language.
- **State** is the shared memory.
- **Plugins** react to events and can emit new events.

## Core Runtime Contract

At runtime, handlers receive:

- `event`: `{ type: string, data: unknown }`
- `context.state`: mutable state for the current run
- `context.runId`: unique run identifier
- `context.suspend()`: stop execution immediately

## Event Flow

1. A run starts with an input event (for agents: `agent:run`).
2. Interceptors run first and can modify or block the event.
3. Matching handlers run and may yield more events.
4. Yielded events are recursively processed by the runtime.
5. A run ends with completion or error events (for agents: `agent:complete`).

## Current Shared Event Conventions

- Agent lifecycle: `agent:run`, `agent:complete`
- Actions: `action:call`, `action:result`, `action:error`
- LLM output: `llm:text:delta`, `llm:text`, `llm:error`
- Workflows: `workflow:*` events

## Current Shared State Conventions

- `state.agent` for agent identity/instructions
- `state.actions` for action/tool capabilities
- `state.messages` for LLM message history (current default)

## Notes

These are conventions, not hard schema enforcement yet. As the ecosystem grows, we can formalize this into stricter package-level protocol types.
