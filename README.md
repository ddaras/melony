# Melony

Fast, unopinionated, minimalist event-based framework for building AI agents.

[![Discord](https://img.shields.io/discord/1331776510344400977?color=7289da&label=discord&logo=discord&logoColor=white)](https://discord.gg/j2uF5n8vJK)

Melony is to AI agents what Express is to web servers — a tiny, flexible orchestration loop: `Event → Handler → Events`.

## What you get

- **Event-first runtime**: a tiny orchestration loop: `Event → Handler → Events`.
- **Fluent Builder API**: build agents with a simple, type-safe API.
- **Plugin system**: easily modularize and reuse handlers across agents.
- **HITL-friendly**: approvals and guardrails belong in **event handlers**.
- **Frontend-ready**: `@melony/react` provides the glue (providers/hooks) to connect your React app to the Melony stream.

## Quick start (full stack)

### Backend (Next.js)

```ts
// app/api/chat/route.ts
import { melony } from "melony";

const agent = melony()
  .on("user:text", async function* (event, { runtime }) {
    // Simple router: respond with a greeting
    yield { type: "assistant:text", data: { content: "Hey there!" } };
  });

export async function POST(req: Request) {
  const { event } = await req.json();
  return agent.streamResponse(event);
}
```

### Frontend (React)

```tsx
import { MelonyClient } from "melony/client";
import { MelonyProvider, useMelony } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function Chat() {
  const { messages, send } = useMelony();
  
  return (
    <div>
      {messages.map(m => (
        <div key={m.runId}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <button onClick={() => send({ type: "user:text", data: { content: "Hello!" } })}>
        Send
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

## Packages

- **`melony`**: The core framework: builder, runtime, and streaming utilities.
- **`melony-react`**: React hooks and providers to connect your app to a Melony stream.

## Examples in this repo

- **`apps/nextjs`**: A full-stack example with a food ordering agent.

## Why Melony

Most "agent frameworks" are heavy and opinionated about how you should build your agent's brain. Melony is different:

**It focuses on the communication protocol.** By treating everything as an event stream, Melony makes it easy to bridge the gap between LLM thoughts and the actual product UX your users need—whether that's text, structured data, or complex interactive flows.

## Community

Join our Discord to connect with the team and other developers: [https://discord.gg/j2uF5n8vJK](https://discord.gg/j2uF5n8vJK)
