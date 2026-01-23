# Getting Started

Get up and running with Melony in less than 5 minutes.

## Installation

Install the core Melony package.

```bash
npm install melony
```

## 1. Define Actions

An **Action** is an async generator that performs a task and yields events. You can define them as standalone async generator functions.

```typescript
export const getWeatherAction = async function* ({ city }: { city: string }) {
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

  // Optional: return a value that will be included in the 'action:after' event
  return { success: true };
};
```

## 2. Create the Runtime

Use the `melony()` builder to create an instance of your agent. Register your actions by providing a name and the generator function.

```typescript
import { melony } from "melony";
import { getWeatherAction } from "./actions/get-weather";

export const agent = melony()
  .action("getWeather", getWeatherAction)
  .on("text", async function* (event, { runtime }) {
    // Simple router: if the message contains "weather", call the action
    if (event.data.content.toLowerCase().includes("weather")) {
      yield* runtime.execute("getWeather", { city: "London" });
    }
  });
```

## 3. Serve your Agent

In a Next.js API route, use the `.stream()` method to stream events back to the client as an SSE-compatible response.

```typescript
// app/api/chat/route.ts
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.stream(event);
}
```

## 4. Consume the Stream (React)

For React apps, use `@melony/react` which provides a provider and hooks to handle the stream and state automatically.

```bash
npm install @melony/react
```

```tsx
import { MelonyClient } from "melony/client";
import { MelonyProvider, useMelony } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function Chat() {
  const { events, send, streaming } = useMelony();

  return (
    <div>
      <div className="messages">
        {events.map(e => e.type === "text" && <p key={e.meta?.id}>{e.data.content}</p>)}
      </div>
      <button 
        disabled={streaming}
        onClick={() => send({ type: "text", data: { content: "How is the weather?" } })}
      >
        Ask Weather
      </button>
    </div>
  );
}

export default function App() {
  return (
    <MelonyProvider client={client}>
      <Chat />
    </MelonyProvider>
  );
}
```

## Next Steps

- Learn about [Core Concepts](./core-concepts.md) to understand how actions and hooks work together.
- Explore [Server-Driven UI](./server-driven-ui.md) to create rich interactive interfaces.
