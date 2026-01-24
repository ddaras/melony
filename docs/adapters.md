# Serving & Client

Melony is designed to be flexible. It provides a core runtime that can be served in various environments and consumed by different clients.

## Serving with `.streamResponse()`

The simplest way to serve a Melony agent is using the `.streamResponse()` method on the builder. It automatically executes the runtime and returns a streaming `Response`.

### Next.js Example

```typescript
// app/api/chat/route.ts
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.streamResponse(event);
}

export async function GET() {
  // Optionally expose config like starter prompts
  return Response.json({
    starterPrompts: [],
  });
}
```

### Manual Streaming with `createStreamResponse`

If you need more control (e.g., using a custom runtime instance), you can use the built-in `createStreamResponse` utility. It converts an async generator into a streaming `Response`.

```typescript
import { createStreamResponse } from "melony";
import { agent } from "./agent";

export async function POST(req: Request) {
  const { event } = await req.json();
  const runtime = agent.build();
  return createStreamResponse(runtime.run(event));
}
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

### `send(event: Event)`

Sends an event to the server and returns an `AsyncGenerator` of events.

```typescript
const stream = client.send({
  type: "user:text",
  data: { content: "Hello!" },
});

for await (const event of stream) {
  // Handle events as they arrive
  console.log(event);
}
```

### Configuration Options

- `url`: The endpoint of your Melony server.
- `headers`: A static object or a function that returns headers (useful for dynamic tokens).
