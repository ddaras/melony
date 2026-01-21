# Melony

Melony is an **event-streaming AI agent runtime** with **Server-Driven UI (SDUI)** — build agents that stream **text and real UI** to your frontend, not just strings.

If you're building _product_ (approval flows, forms, dashboards, tool results), Melony's core idea is simple:

- **Your backend "renders" UI** as a typed `UINode` tree
- Your frontend **renders that UI automatically** (React included)
- Everything is an **event stream**, so you get streaming UX by default

## What you get

- **SDUI out of the box**: `ui.card(...)`, `ui.form(...)`, `ui.button(...)`, etc. — emitted from actions.
- **Event-first runtime**: a tiny orchestration loop: `Event → Hook → Action → Events`.
- **HITL-friendly architecture**: approvals and guardrails belong in **plugins** / hooks.
- **Frontend-ready**: `@melony/react` renders chat + SDUI and `melony/client` streams events over HTTP.

## Quick start (full stack)

### Backend (Next.js)

```ts
// app/api/chat/route.ts
import { MelonyRuntime, action, ui, createStreamResponse } from "melony";
import { z } from "zod";

const agent = new MelonyRuntime({
  actions: {
    greet: action({
      name: "greet",
      paramsSchema: z.object({ name: z.string().optional() }),
      execute: async function* ({ name }) {
        yield { type: "text", data: { content: `Hey${name ? ` ${name}` : ""}!` } };
        yield { type: "ui", data: ui.card({ title: "Next step", children: [ui.text("Ask me anything.")] }) };
      },
    }),
  },
  hooks: {
    onBeforeRun: async function* ({ event }) {
      if (event.type === "text") return { action: "greet", params: {} };
    },
  },
});

export async function POST(req: Request) {
  const { event } = await req.json();
  return createStreamResponse(agent.run(event));
}
```

### Frontend (React)

```tsx
import { MelonyProvider, Thread } from "@melony/react";

export default function App() {
  return (
    <MelonyProvider url="/api/chat">
      <Thread />
    </MelonyProvider>
  );
}
```

## Packages

- **`melony`**: runtime (`MelonyRuntime`), SDUI contract (`ui`), plugins/hooks, streaming helpers.
- **`@melony/react`**: chat UI + providers/hooks + SDUI renderer for React.

## Examples in this repo

- **`apps/nextjs`**: an example Next.js app with a food ordering agent.
- **`apps/vite-app`**: an example React frontend (Vite).

## Why Melony

Most "agent frameworks" stop at tool calling. Melony's best selling point is:

**It lets your agent ship product UX via a typed, streaming UI protocol** — so "tool results" aren't blobs of text, they become buttons, forms, cards, lists, charts, and flows your users can actually use.
