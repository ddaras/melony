# melony

A small **event-streaming runtime** for AI agents with first-class **Server-Driven UI (SDUI)**.

## Installation

```bash
npm install melony
```

## Quick Start

### 🔥 New: Fluent Builder API (Recommended)

```ts
import { melony, createStreamResponse } from "melony";

const agent = melony()
  .action("getWeather", "Get weather for a city", async function* ({ city }: { city: string }) {
    yield {
      type: "ui",
      data: {
        type: "card",
        title: `Weather in ${city}`,
        children: [{ type: "text", value: "Sunny, 24°C" }]
      }
    };
  })
  .action("getMenu", {
    description: "Get the current food menu",
    execute: async function* () {
      yield { type: "text", data: { content: "Here's our menu..." } };
    }
  })
  .build();

// Run it
for await (const event of agent.run({ type: "text", data: { content: "London" } })) {
  console.log(event);
}
```

### Legacy: Runtime Class API (Still Supported)

```ts
import { MelonyRuntime, action, createStreamResponse } from "melony";

// 1. Define actions
const getWeather = action({
  name: "getWeather",
  description: "Get weather for a city",
  execute: async function* ({ city }: { city: string }) {
    yield {
      type: "ui",
      data: {
        type: "card",
        title: `Weather in ${city}`,
        children: [{ type: "text", value: "Sunny, 24°C" }]
      }
    };
  },
});

// 2. Create the runtime
const agent = new MelonyRuntime({
  actions: { getWeather },
});

// 3. Run it
for await (const event of agent.run({ type: "text", data: { content: "London" } })) {
  console.log(event);
}
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

  // Action with description
  .action("placeOrder", "Place a food order", async function* ({ itemId, quantity }) {
    yield { type: "text", data: { content: `Ordered ${quantity} items!` } };
  })

  // Action with full config object
  .action("getMenu", {
    description: "Get the current menu",
    execute: async function* () {
      yield { type: "text", data: { content: "Here's our menu..." } };
    }
  })

  // Add pre-defined actions from separate files
  .action(getWeatherAction)
  .action(placeOrderAction);
```

### Plugin Integration
```ts
const agent = melony()
  .action("getWeather", async function* ({ city }) {
    // action logic
  })
  .use(llmRouterPlugin())
  .use(actionUiRendererPlugin())
  .build();
```

### TypeScript Benefits
- **Full type inference** through the entire chain
- **IntelliSense** for all methods and parameters
- **Generic propagation** maintains type safety
- **Backward compatible** with existing code

## Core Concepts

- **Event**: The universal unit of streaming (`{ type, data, meta }`).
- **Action**: An async generator that yields events. Defined with the `action()` helper.
- **Plugins**: Intercept runs, actions, and events for orchestration, HITL, logging, etc.
- **SDUI**: Stream typed UI structures as JSON events to your frontend.

## License

MIT
