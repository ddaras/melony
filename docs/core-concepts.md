# Core Concepts

Understanding the building blocks of a Melony agent.

## Events: The Universal Currency

In Melony, everything is an **Event**. Whether it's a piece of text, a UI component, or a tool result, it's represented as a standard event object.

```typescript
interface MelonyEvent {
  type: string;
  role?: "user" | "assistant" | "system";
  data?: any;
  ui?: UINode; // SDUI payload
}
```

The Melony runtime manages the flow of these events from the server to the client.

## Actions: Where the Work Happens

An **Action** is an asynchronous generator function that performs a specific task. It can yield any number of events.

- **`name`**: Unique identifier for the action.
- **`description`**: Used for orchestration or LLM tool calling.
- **`paramsSchema`**: A Zod schema defining the input.
- **`execute`**: The function logic.

```typescript
const myAction = action({
  name: "do_something",
  paramsSchema: z.object({ name: z.string() }),
  execute: async function* ({ name }) {
    yield { type: "text", data: { content: `Hello ${name}` } };
  }
});
```

### The `NextAction` Return

An action can optionally `return` a `NextAction` object. This tells the runtime what to do next (e.g., call another action or wait for user input).

```typescript
return {
  action: "next_step",
  params: { id: 123 }
};
```

## Hooks: Pluggable Orchestration

Hooks allow you to intercept the execution flow. They are the "middleware" of Melony.

### `onBeforeRun`
Triggered before any action is executed. Use this to:
- Route incoming user messages to specific actions.
- Add context to the run.
- Implement security checks.

### `onAfterAction`
Triggered after an action completes. Use this to:
- Log results.
- Trigger side effects.
- Override the next action.

## Plugins: Packaging Logic

Plugins are simply a collection of hooks. This allows you to package and reuse complex logic like:
- **Persistence**: Saving event history to a database.
- **HITL (Human-in-the-Loop)**: Pausing execution for human approval.
- **LLM Routing**: Using an LLM to decide which action to call.

```typescript
import { persistPlugin } from "./plugins/persist";

const assistant = melony({
  actions: { ... },
  plugins: [persistPlugin({ dbUrl: "..." })]
});
```
