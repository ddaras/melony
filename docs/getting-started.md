# Getting Started

Get up and running with Melony in less than 5 minutes.

## Installation

Melony requires `zod` for schema validation.

```bash
npm install melony zod
```

## 1. Define Actions

An **Action** is an async generator that performs a task and yields events.

```typescript
import { action } from "melony";

export const getWeatherAction = action({
  name: "getWeather",
  execute: async function* ({ city }) {
    // Yield a text event
    yield { type: "text", data: { content: `Checking weather for ${city}...` } };

    // Yield custom data or UI events
    yield {
      type: "weather-data",
      data: {
        city,
        temp: 24,
        condition: "Sunny"
      },
    };
  },
});
```

## 2. Create the Runtime

Use the `melony()` builder to create an instance of your agent.

```typescript
import { melony } from "melony";
import { getWeatherAction } from "./actions/get-weather";

export const agent = melony()
  .action(getWeatherAction)
  .on("text", async function* (event, { runtime }) {
    // Simple router
    if (event.data.content.includes("weather")) {
      yield* runtime.execute("getWeather", { city: "London" });
    }
  })
  .build();
```

## 3. Serve your Agent

Use the `.stream()` method to stream events back to the client as an HTTP response.

```typescript
// app/api/chat/route.ts (Next.js example)
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.stream(event);
}
```

## 4. Consume the Stream (Client Side)

Use the `MelonyClient` to send events and consume the stream.

```typescript
import { MelonyClient } from "melony/client";

const client = new MelonyClient({ url: "/api/chat" });

async function chat(city: string) {
  const stream = client.sendEvent({
    type: "text",
    data: { content: city },
  });

  for await (const event of stream) {
    console.log("Received event:", event);
  }
}

chat("London");
```

## Next Steps

- Learn about [Core Concepts](./core-concepts.md) to understand how actions and hooks work together.
- Explore [Server-Driven UI](./server-driven-ui.md) to create rich interactive interfaces.
