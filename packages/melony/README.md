# melony

A small **event-streaming runtime** for AI agents with first-class **Server-Driven UI (SDUI)**.

## Installation

```bash
npm install melony zod
```

## Quick Start

```ts
import { MelonyRuntime, action, ui, createStreamResponse } from "melony";
import { z } from "zod";

// 1. Define actions
const getWeather = action({
  name: "getWeather",
  description: "Get weather for a city",
  paramsSchema: z.object({ city: z.string() }),
  execute: async function* ({ city }) {
    yield { type: "ui", data: ui.card({ title: `Weather in ${city}`, children: [ui.text("Sunny, 24°C")] }) };
  },
});

// 2. Create the runtime
const agent = new MelonyRuntime({
  actions: { getWeather },
});

// 3. Run it
for await (const event of agent.run({ type: "text", data: { content: "London" }, nextAction: { action: "getWeather", params: { city: "London" } } })) {
  console.log(event);
}
```

## Core Concepts

- **Event**: The universal unit of streaming (`{ type, data, meta }`).
- **Action**: An async generator that yields events. Defined with the `action()` helper.
- **Hooks/Plugins**: Intercept runs, actions, and events for orchestration, HITL, logging, etc.
- **SDUI**: Stream typed UI to the frontend using the `ui` builder.

## License

MIT
