# Core Concepts

Understanding the building blocks of a Melony agent.

## Events: The Universal Currency

In Melony, everything is an **Event**. Whether it's a piece of text, a UI component, or a tool result, it's represented as a standard event object.

```typescript
interface Event {
  type: string;
  data: any;
  meta?: EventMeta; // id, runId, timestamp, role, state, etc.
  nextAction?: NextAction;
}
```

The `MelonyRuntime` manages the flow of these events from the server to the client.

## Actions: Where the Work Happens

An **Action** is an asynchronous generator function that performs a specific task. It can yield any number of events.

Define actions using the `action()` helper for full type inference:

```typescript
import { action } from "melony";
import { z } from "zod";

const myAction = action({
  name: "doSomething",
  description: "A helpful description for LLM tool-calling",
  paramsSchema: z.object({ name: z.string() }),
  execute: async function* ({ name }, context) {
    yield { type: "text", data: { content: `Hello ${name}` } };
  },
});
```

### The `NextAction` Return

An action can optionally `return` a `NextAction` object. This tells the runtime to execute another action next.

```typescript
execute: async function* ({ query }) {
  const data = await search(query);
  // Chain to another action
  return { action: "summarize", params: { data } };
}
```

## Plugins: Extensible Orchestration

Plugins allow you to intercept the execution flow. They are the "middleware" of Melony and provide lifecycle hooks for custom behavior.

### Available Plugin Hooks

- **`onBeforeRun`**: Called when a run starts. Use it to route incoming events to specific actions.
- **`onAfterRun`**: Called after a run completes. Use it for cleanup or logging.
- **`onBeforeAction`**: Called before an action executes. Use it for validation or HITL approval.
- **`onAfterAction`**: Called after an action completes. Use it to log results or override the next action.
- **`onEvent`**: Called for every event yielded. Use it for persistence or logging.

### Example: Routing with `onBeforeRun`

```typescript
const agent = new MelonyRuntime({
  actions: { getWeather, placeOrder },
  plugins: [
    plugin({
      name: "router",
      onBeforeRun: async function* ({ event }) {
        // Route text messages to an action
        if (event.type === "text" && event.data.content.includes("weather")) {
          return { action: "getWeather", params: { city: "NYC" } };
        }
      },
    }),
  ],
});
```

## Building Plugins

Plugins are named collections of lifecycle hooks that can be reused across agents.

```typescript
import { plugin } from "melony";

const loggingPlugin = plugin({
  name: "logging",
  onEvent: async function* (event) {
    console.log("Event:", event.type);
  },
});

const agent = new MelonyRuntime({
  actions: { ... },
  plugins: [loggingPlugin],
});
```

Built-in plugins:
- **`requireApproval`**: Adds Human-in-the-Loop approval for sensitive actions.
