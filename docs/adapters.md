# Adapters & Client

Melony is designed to be flexible. It provides a core runtime that can be adapted to various server environments and consumed by different clients.

## Server Adapters

Adapters bridge the Melony runtime with your web framework's request/response lifecycle.

### Hono Adapter

Hono is the recommended way to serve Melony agents due to its speed and support for edge environments (Cloudflare Workers, Deno, etc.).

```typescript
import { Hono } from "hono";
import { handle } from "melony/adapters/hono";
import { assistant } from "./assistant";

const app = new Hono();
app.post("/api/chat", handle(assistant));
```

### Custom Adapters

If you are using a framework without a built-in adapter (like Express or Fastify), you can use the `runtime.run()` method directly and stream the results using standard Server-Sent Events (SSE) or simple JSON streaming.

```typescript
// Conceptual example for a custom handler
import { assistant } from "./assistant";

async function handleRequest(req, res) {
  const event = await req.json();
  const stream = assistant.run(event);

  for await (const chunk of stream) {
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
    "Authorization": `Bearer ${getToken()}`
  })
});
```

### `sendEvent(event: MelonyEvent)`

Sends an event to the server and returns an `AsyncGenerator` of events.

```typescript
const stream = client.sendEvent({
  type: "text",
  role: "user",
  data: { content: "Hello!" }
});

for await (const event of stream) {
  // Handle events as they arrive
}
```

### Configuration Options

- `url`: The endpoint of your Melony server.
- `headers`: A static object or a function that returns headers (useful for dynamic tokens).
- `onEvent`: A callback triggered for every event in the stream (useful for global logging).
