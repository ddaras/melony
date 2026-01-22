# Core Concepts

Understanding the building blocks of a Melony agent.

## Events: The Universal Currency

In Melony, everything is an **Event**. Whether it's a piece of text, a tool result, or custom data, it's represented as a standard event object.

```typescript
interface Event {
  type: string;
  data: any;
  meta?: EventMeta; // id, runId, timestamp, role, state, etc.
}
```

The `MelonyRuntime` (created via the `melony()` builder) manages the flow of these events from the server to the client.

## Actions: Where the Work Happens

An **Action** is a simple asynchronous generator function that performs a specific task. It can yield any number of events.

Define actions as pure async generators:

```typescript
export const myAction = async function* ({ name }: { name: string }, context) {
  yield { type: "text", data: { content: `Hello ${name}` } };
  return { status: "success" };
};
```

Register them with the agent:

```typescript
const agent = melony()
  .action("doSomething", myAction);
```

### Action Context

Actions receive a `context` object which provides:
- `state`: The current run state.
- `runtime`: Access to the runtime instance (to execute other actions).
- `runId`: Unique ID for the current execution.
- `suspend`: A function to immediately halt execution (useful for HITL).

## Event Handlers: Reactive Logic

Event handlers are the "brain" of your agent. They listen for specific event types and can yield new events or trigger actions. This event-driven approach allows for highly decoupled and reactive logic.

### Example: Routing with Event Handlers

```typescript
const agent = melony()
  .action(getWeather)
  .on("text", async function* (event, { runtime }) {
    // Route text messages to an action based on content
    if (event.data.content.includes("weather")) {
      yield* runtime.execute("getWeather", { city: "NYC" });
    }
  });
```

## Plugin System: Modular Agent Logic

Melony features a lightweight plugin system that allows you to modularize and reuse actions and handlers across different agents. A plugin is simply a function that receives the `MelonyBuilder`.

```typescript
import { melony, MelonyPlugin } from "melony";

const loggingPlugin: MelonyPlugin = (builder) => {
  builder.on("action:before", async function* (event) {
    console.log(`[Plugin] Executing: ${event.data.action}`);
  });
};

const agent = melony()
  .use(loggingPlugin)
  .action("greet", async function* () {
    yield { type: "text", data: { content: "Hello!" } };
  });
```

### Chaining & Recursion

When a handler yields an event, that event is automatically passed back through the runtime's handlers. This allows for powerful, recursive behaviors.

```typescript
const agent = melony()
  .on("greet", async function* () {
    yield { type: "text", data: { content: "Hello!" } };
  })
  .on("text", async function* (event) {
    if (event.data.content === "hi") {
      yield { type: "greet", data: {} }; // This will trigger the 'greet' handler
    }
  });
```
