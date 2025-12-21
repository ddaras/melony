# Melony

Melony is an **event-streaming AI agent runtime** with **Server‑Driven UI (SDUI)** — build agents that stream **text and real UI** to your frontend, not just strings.

If you’re building *product* (approval flows, forms, dashboards, tool results), Melony’s core idea is simple:

- **Your backend “renders” UI** as a typed `UINode` tree
- Your frontend **renders that UI automatically** (React included)
- Everything is an **event stream**, so you get streaming UX by default

## What you get

- **SDUI out of the box**: `ui.card(...)`, `ui.form(...)`, `ui.button(...)`, etc. — emitted from actions/brains.
- **Event-first runtime**: a tiny orchestration loop: `Event → Brain → Action → Events`.
- **HITL-friendly architecture**: approvals and guardrails belong in **plugins** / hooks.
- **Frontend-ready**: `@melony/react` renders chat + SDUI and `@melony/core/client` streams events over HTTP.

## Quick start (full stack)

### Backend (Hono)

```ts
import { Hono } from "hono";
import { melony, action, ui } from "@melony/core";
import { handle } from "@melony/core/adapters/hono";
import { z } from "zod";

const app = new Hono();

const assistant = melony({
  actions: {
    greet: action({
      name: "greet",
      paramsSchema: z.object({ name: z.string().optional() }),
      execute: async function* ({ name }) {
        yield { type: "text", data: { content: `Hey${name ? ` ${name}` : ""}!` } };
        yield { type: "ui", ui: ui.card({ title: "Next step", children: [ui.text("Ask me anything.")] }) };
      },
    }),
  },
  brain: async function* (event) {
    if (event.type === "text") return { action: "greet", params: {} };
  },
});

app.post("/api/chat", handle(assistant));
export default app;
```

### Frontend (React)

```tsx
import React from "react";
import { MelonyClient, createHttpTransport } from "@melony/core/client";
import { MelonyClientProvider, Thread } from "@melony/react";

const client = new MelonyClient(createHttpTransport("/api/chat"));

export default function App() {
  return (
    <MelonyClientProvider client={client}>
      <Thread />
    </MelonyClientProvider>
  );
}
```

## Packages

- **`@melony/core`**: runtime (`melony()`), SDUI contract (`ui`), plugins/hooks, streaming helpers, adapters.
- **`@melony/react`**: chat UI + providers/hooks + SDUI renderer for React.

## Examples in this repo

- **`apps/agent`**: an example backend (Hono adapter).
- **`apps/vite-app`**: an example React frontend (Vite).

## Why Melony (the selling point)

Most “agent frameworks” stop at tool calling. Melony’s best selling point is:

**It lets your agent ship product UX via a typed, streaming UI protocol** — so “tool results” aren’t blobs of text, they become buttons, forms, cards, lists, charts, and flows your users can actually use.
