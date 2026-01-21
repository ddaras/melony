# Melony

Fast, unopinionated, minimalist event-based framework for building AI agents with **Server-Driven UI (SDUI)**.

Melony is to AI agents what Express is to web servers — a tiny, flexible orchestration loop: `Event → Handler → Actions → Events`.

If you're building _product_ (approval flows, forms, dashboards, tool results), Melony's core idea is simple:

- **Your backend "renders" UI** as a typed `UINode` tree
- Your frontend **renders that UI automatically** (React included)
- Everything is an **event stream**, so you get streaming UX by default

## What you get

- **Event-first runtime**: a tiny orchestration loop: `Event → Handler → Actions → Events`.
- **HITL-friendly**: approvals and guardrails belong in **event handlers**.
- **SDUI protocol**: Stream typed UI structures as JSON events to your frontend.
- **Frontend-ready**: `@melony/react` provides the glue (providers/hooks) to connect your React app to the Melony stream.

## Quick start (full stack)

### Backend (Next.js)

```ts
// app/api/chat/route.ts
import { melony, createStreamResponse } from "melony";
import { z } from "zod";

const agent = melony()
  .action("greet", async function* ({ name }: { name?: string }) {
    yield { type: "text", data: { content: `Hey${name ? ` ${name}` : ""}!` } };
    yield {
      type: "ui",
      data: {
        type: "card",
        title: "Next step",
        children: [{ type: "text", value: "Ask me anything." }]
      }
    };
  })
  .on("text", async function* (event, { runtime }) {
    // Simple router: call greet action for any text event
    yield* runtime.execute("greet", { name: "User" });
  })
  .build();

export async function POST(req: Request) {
  const { event } = await req.json();
  return createStreamResponse(agent.run(event));
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

- **`melony`**: runtime (`MelonyRuntime`), plugins/hooks, streaming helpers.
- **`@melony/react`**: chat UI + providers/hooks + SDUI renderer for React.

## Examples in this repo

- **`apps/nextjs`**: an example Next.js app with a food ordering agent.
- **`apps/vite-app`**: an example React frontend (Vite).

## Why Melony

Most "agent frameworks" stop at tool calling. Melony's best selling point is:

**It lets your agent ship product UX via a typed, streaming UI protocol** — so "tool results" aren't blobs of text, they become buttons, forms, cards, lists, charts, and flows your users can actually use.
