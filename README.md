# Melony

Fast, unopinionated, minimalist event-based framework for building AI agents.

Melony is to AI agents what Express is to web servers — a tiny, flexible orchestration loop: `Event → Handler → Actions → Events`.

## What you get

- **Event-first runtime**: a tiny orchestration loop: `Event → Handler → Actions → Events`.
- **HITL-friendly**: approvals and guardrails belong in **event handlers**.
- **Frontend-ready**: `@melony/react` provides the glue (providers/hooks) to connect your React app to the Melony stream.

## Quick start (full stack)

### Backend (Next.js)

```ts
// app/api/chat/route.ts
import { melony } from "melony";

const agent = melony()
  .action("greet", async function* ({ name }: { name?: string }) {
    yield { type: "text", data: { content: `Hey${name ? ` ${name}` : ""}!` } };
  })
  .on("text", async function* (event, { runtime }) {
    // Simple router: call greet action for any text event
    yield* runtime.execute("greet", { name: "User" });
  });

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.stream(event);
}
```

### Frontend (React)

```tsx
import { MelonyClient } from "melony/client";
import { MelonyProvider, useMelony } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function Chat() {
  const { messages, sendEvent } = useMelony();
  // Render your chat UI here
  return <div>...</div>;
}

export default function App() {
  return (
    <MelonyProvider client={client}>
      <Chat />
    </MelonyProvider>
  );
}
```

## Packages

- **`melony`**: The core framework: builder, runtime, and streaming utilities.
- **`@melony/react`**: React hooks and providers to connect your app to a Melony stream.

## Examples in this repo

- **`apps/nextjs`**: A full-stack example with a food ordering agent.
- **`apps/vite-app`**: A minimalist React frontend example.

## Why Melony

Most "agent frameworks" are heavy and opinionated about how you should build your agent's brain. Melony is different:

**It focuses on the communication protocol.** By treating everything as an event stream, Melony makes it easy to bridge the gap between LLM thoughts and the actual product UX your users need—whether that's text, structured data, or complex interactive flows.
