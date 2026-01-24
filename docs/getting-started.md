# Getting Started

Get up and running with Melony in less than 5 minutes.

## Installation

Install the core Melony package.

```bash
npm install melony
```

## 1. Create the Runtime

Use the `melony()` builder to create an instance of your agent. Register your event handlers by providing the event type and a generator function.

```typescript
import { melony } from "melony";

export const agent = melony()
  .on("user:text", async function* (event, { runtime }) {
    // Simple router: if the message contains "weather", yield weather info
    if (event.data.content.toLowerCase().includes("weather")) {
      yield { 
        type: "assistant:text", 
        data: { content: "Checking weather for London... It is 24°C and Sunny." } 
      };
      
      // You can also yield custom data or UI events
      yield {
        type: "weather-data",
        data: {
          city: "London",
          temp: 24,
          condition: "Sunny"
        },
      };
    }
  });
```

## 2. Serve your Agent

In a Next.js API route, use the `.streamResponse()` method to stream events back to the client as an SSE-compatible response.

```typescript
// app/api/chat/route.ts
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.streamResponse(event);
}
```

## 3. Consume the Stream (React)

For React apps, use `@melony/react` which provides a provider and hooks to handle the stream and state automatically.

```bash
npm install @melony/react
```

```tsx
import { MelonyClient } from "melony/client";
import { MelonyProvider, useMelony } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function Chat() {
  const { messages, send, streaming } = useMelony();

  return (
    <div>
      <div className="messages">
        {messages.map(m => (
          <div key={m.runId}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      <button 
        disabled={streaming}
        onClick={() => send({ type: "user:text", data: { content: "How is the weather?" } })}
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

- Learn about [Core Concepts](./core-concepts.md) to understand how handlers and plugins work together.
- Explore [Server-Driven UI](./server-driven-ui.md) to create rich interactive interfaces.
