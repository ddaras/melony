# melony

Fast, unopinionated, minimalist event-based framework for AI agents.

## Installation

```bash
npm install melony
```

### 🔥 New: Fluent Builder API (Recommended)

```ts
import { melony } from "melony";

const agent = melony()
  .on("user:text", async function* (event, { runtime }) {
    if (event.data.content.includes("weather")) {
      yield { type: "assistant:text", data: { content: "Weather in London is 24°C" } };
    }
  });

// Run it (or use agent.streamResponse(event) for HTTP)
for await (const event of agent.build().run({ type: "user:text", data: { content: "How's the weather?" } })) {
  console.log(event);
}
```

### Legacy: Runtime Class API (Still Supported)

```ts
import { Runtime } from "melony";

// 1. Create the runtime
const agent = new Runtime({
  eventHandlers: new Map([
    ["user:text", [async function* (event, { runtime }) {
      if (event.data.content.includes("weather")) {
        yield { type: "assistant:text", data: { content: "Weather in London is sunny!" } };
      }
    }]]
  ])
});
```

## Fluent Builder API

The fluent builder provides an excellent developer experience with method chaining:

### Event Handlers
```ts
const agent = melony()
  .on("user:text", async function* (event, { runtime }) {
    // Intercept and handle events
    if (event.data.content.includes("help")) {
      yield { type: "assistant:text", data: { content: "How can I help you?" } };
    }
  })
  .on("assistant:text", async function* (event) {
    console.log(`Agent said: ${event.data.content}`);
  })
  .build();
```

### Plugin System
Plugins allow you to modularize and reuse handlers across different agents. A plugin is simply a function that receives the `MelonyBuilder`.

```ts
import { melony, MelonyPlugin } from "melony";

const loggingPlugin: MelonyPlugin = (builder) => {
  builder.on("*", async function* (event) {
    console.log(`[Plugin] Event: ${event.type}`);
  });
};

const agent = melony()
  .use(loggingPlugin)
  .on("user:text", async function* () {
    yield { type: "assistant:text", data: { content: "Hello!" } };
  });
```

### TypeScript Benefits
- **Full type inference** through the entire chain
- **IntelliSense** for all methods and parameters
- **Generic propagation** maintains type safety
- **Minimalist core** with zero required dependencies

## Core Concepts

- **Event**: The universal unit of streaming (`{ type, data, meta }`).
- **Event Handlers**: Reactive functions that listen to and emit events.

## License

MIT
