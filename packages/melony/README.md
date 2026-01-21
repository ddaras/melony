# melony

Fast, unopinionated, minimalist event-based framework for AI agents.

## Installation

```bash
npm install melony
```

## Quick Start

### 🔥 New: Fluent Builder API (Recommended)

```ts
import { melony, createStreamResponse } from "melony";

const agent = melony()
  .action("getWeather", async function* ({ city }: { city: string }) {
    yield {
      type: "ui",
      data: {
        type: "card",
        title: `Weather in ${city}`,
        children: [{ type: "text", value: "Sunny, 24°C" }]
      }
    };
  })
  .on("text", async function* (event, { runtime }) {
    if (event.data.content.includes("weather")) {
      yield* runtime.execute("getWeather", { city: "London" });
    }
  })
  .build();

// Run it
for await (const event of agent.run({ type: "text", data: { content: "How's the weather?" } })) {
  console.log(event);
}
```

### Legacy: Runtime Class API (Still Supported)

```ts
import { MelonyRuntime, createStreamResponse } from "melony";

// 1. Create the runtime
const agent = new MelonyRuntime({
  actions: { 
    getWeather: {
      name: "getWeather",
      execute: async function* ({ city }: { city: string }) {
        yield { type: "text", data: { content: `Weather in ${city} is sunny!` } };
      }
    }
  },
  eventHandlers: new Map([
    ["text", [async function* (event, { runtime }) {
      yield* runtime.execute("getWeather", { city: "London" });
    }]]
  ])
});
```

## Fluent Builder API

The fluent builder provides an excellent developer experience with method chaining:

### Action Definition
```ts
const agent = melony()
  // Simple action with name and handler
  .action("getWeather", async function* ({ city }) {
    yield { type: "text", data: { content: `Weather in ${city} is sunny!` } };
  })

  // Action with full config object
  .action({
    name: "placeOrder",
    execute: async function* ({ itemId, quantity }) {
      yield { type: "text", data: { content: `Ordered ${quantity} items!` } };
    }
  });
```

### Event Handlers
```ts
const agent = melony()
  .on("text", async function* (event, { runtime }) {
    // Intercept and handle events
    if (event.data.content.includes("help")) {
      yield { type: "text", data: { content: "How can I help you?" } };
    }
  })
  .on("action:before", async function* (event) {
    console.log(`Executing action: ${event.data.action}`);
  })
  .build();
```

### TypeScript Benefits
- **Full type inference** through the entire chain
- **IntelliSense** for all methods and parameters
- **Generic propagation** maintains type safety
- **Minimalist core** with zero required dependencies (except optional Zod)

## Core Concepts

- **Event**: The universal unit of streaming (`{ type, data, meta }`).
- **Action**: An async generator that yields events.
- **Event Handlers**: Reactive functions that listen to and emit events.
- **SDUI**: Stream typed UI structures as JSON events to your frontend.

## License

MIT
