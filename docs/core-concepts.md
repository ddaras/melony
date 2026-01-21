# Core Concepts

Understanding the building blocks of a Melony agent.

## Events: The Universal Currency

In Melony, everything is an **Event**. Whether it's a piece of text, a UI component, or a tool result, it's represented as a standard event object.

```typescript
interface Event {
  type: string;
  data: any;
  meta?: EventMeta; // id, runId, timestamp, role, state, etc.
}
```

The `MelonyRuntime` (created via the `melony()` builder) manages the flow of these events from the server to the client.

## Actions: Where the Work Happens

An **Action** is an asynchronous generator function that performs a specific task. It can yield any number of events.

Define actions inline with the builder or separately using the `action()` helper:

```typescript
import { action } from "melony";

const myAction = action({
  name: "doSomething",
  execute: async function* ({ name }, context) {
    yield { type: "text", data: { content: `Hello ${name}` } };
  },
});
```

### Action Context

Actions receive a `context` object which provides:
- `state`: The current run state.
- `runtime`: Access to the runtime instance (to execute other actions).
- `runId`: Unique ID for the current execution.
- `suspend`: A function to immediately halt execution (useful for HITL).

## Event Handlers: Reactive Logic

Event handlers are the "brain" of your agent. They listen for specific event types and can yield new events or trigger actions. This replaces the traditional "plugin" or "middleware" system with a more flexible, event-driven approach.

### Example: Routing with Event Handlers

```typescript
const agent = melony()
  .action(getWeather)
  .on("text", async function* (event, { runtime }) {
    // Route text messages to an action based on content
    if (event.data.content.includes("weather")) {
      yield* runtime.execute("getWeather", { city: "NYC" });
    }
  })
  .build();
```

### Built-in Events

Melony emits several built-in events that you can hook into:
- **`action:before`**: Emitted before an action starts.
- **`action:after`**: Emitted after an action completes.
- **`call-action`**: Used to trigger an action execution (handled automatically by the builder).
- **`error`**: Emitted when something goes wrong.

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
  })
  .build();
```
