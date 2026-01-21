# Getting Started

Get up and running with Melony in less than 5 minutes.

## Installation

Melony requires `zod` for schema validation.

```bash
npm install melony zod
```

## 1. Define your Agent

A Melony agent is defined by its **actions** and **hooks**. 

```typescript
import { melony, action, ui } from "melony";
import { z } from "zod";

export const assistant = melony({
  actions: {
    getWeather: action({
      name: "getWeather",
      description: "Get the current weather",
      paramsSchema: z.object({ city: z.string() }),
      execute: async function* ({ city }) {
        yield { type: "text", data: { content: `Checking weather for ${city}...` } };
        
        // SDUI: Stream a UI card to the frontend
        yield {
          type: "ui",
          ui: ui.card({
            title: `Weather in ${city}`,
            children: [
              ui.text("Sunny, 24°C"),
              ui.button({ label: "Refresh", action: "getWeather", params: { city } })
            ],
          }),
        };
      },
    }),
  },
  
  // Orchestration: Route user messages to actions
  hooks: {
    onBeforeRun: async function* (input) {
      if (input.event.type === "text") {
        return {
          action: "getWeather",
          params: { city: input.event.data?.content },
        };
      }
    },
  },
});
```

## 2. Serve your Agent

Melony provides adapters for common frameworks. Here is how to serve it using **Hono**.

```typescript
import { Hono } from "hono";
import { handle } from "melony/adapters/hono";
import { assistant } from "./assistant";

const app = new Hono();

// This endpoint will stream events to the client
app.post("/api/chat", handle(assistant));

export default app;
```

## 3. Consume the Stream (Client Side)

Use the `MelonyClient` to send events and consume the stream.

```typescript
import { MelonyClient } from "melony/client";

const client = new MelonyClient({ url: "/api/chat" });

async function chat(message: string) {
  const stream = client.sendEvent({
    type: "text",
    role: "user",
    data: { content: message },
  });

  for await (const event of stream) {
    console.log("Received event:", event);
  }
}

chat("London");
```

## Next Steps

- Learn about [Core Concepts](./core-concepts.md) to understand how actions and hooks work together.
- Explore the [SDUI Builder](./server-driven-ui.md) to create rich interactive interfaces.
