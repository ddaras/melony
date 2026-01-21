# Serving & Client

Melony is designed to be flexible. It provides a core runtime that can be served in various environments and consumed by different clients.

## Serving with `createStreamResponse`

The simplest way to serve a Melony agent is using the built-in `createStreamResponse` utility. It converts the async generator from `runtime.run()` into a streaming `Response`.

### Next.js Example

```typescript
// app/api/chat/route.ts
import { createStreamResponse } from "melony";
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  return createStreamResponse(agent.run(event));
}

export async function GET() {
  // Optionally expose config like starter prompts
  return Response.json({
    starterPrompts: agent.config.starterPrompts || [],
  });
}
```

### Hono Example

Using the built-in Hono adapter:

```typescript
import { Hono } from "hono";
import { handle } from "melony/adapters/hono";
import { agent } from "./agent";

const app = new Hono();

// The handle adapter manages GET (config) and POST (run) for you
app.all("/api/chat", handle(agent));
```

Or manually with `createStreamResponse`:

```typescript
import { Hono } from "hono";
import { createStreamResponse } from "melony";
import { agent } from "./agent";

const app = new Hono();

app.post("/api/chat", async (c) => {
  const { event } = await c.req.json();
  return createStreamResponse(agent.run(event));
});
```

### Custom Streaming

If you need more control, you can iterate over the generator manually:

```typescript
async function handleRequest(req, res) {
  const { event } = await req.json();
  
  for await (const chunk of agent.run(event)) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }
  res.end();
}
```

## Melony Client

The `MelonyClient` is a lightweight, framework-agnostic library for communicating with your Melony server.

```typescript
import { MelonyClient } from "melony/client";

const client = new MelonyClient({
  url: "/api/chat",
  // Optional: custom headers for auth
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
  }),
});
```

### `sendEvent(event: Event)`

Sends an event to the server and returns an `AsyncGenerator` of events.

```typescript
const stream = client.sendEvent({
  type: "text",
  data: { content: "Hello!" },
  nextAction: { action: "greet", params: {} },
});

for await (const event of stream) {
  // Handle events as they arrive
  console.log(event);
}
```

### Configuration Options

- `url`: The endpoint of your Melony server.
- `headers`: A static object or a function that returns headers (useful for dynamic tokens).
