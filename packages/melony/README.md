# melony

Melony Core is a small **event-streaming runtime** for AI agents with first-class **Server‑Driven UI (SDUI)**.

You write a `brain` (decides what to do) and `actions` (do work and stream events). Actions/brains can stream:

- **Text** (`{ type: "text" }` / `{ type: "text-delta" }`)
- **UI trees** (`event.ui = ui.card(...)`) that React (and other renderers) can display
- Any custom events you want (`{ type: "tool-result", data: ... }`)

## Installation

```bash
npm install melony zod
```

## 60-second usage

### 1) Define an agent runtime

```ts
import { melony, action, ui } from "melony";
import { z } from "zod";

export const assistant = melony({
  actions: {
    searchProducts: action({
      name: "searchProducts",
      description: "Search products by keyword",
      paramsSchema: z.object({ query: z.string() }),
      execute: async function* ({ query }) {
        yield { type: "text", data: { content: `Searching for "${query}"...` } };

        // SDUI: stream real UI to the frontend
        yield {
          type: "ui",
          ui: ui.card({
            title: "Results",
            children: [
              ui.list([
                ui.listItem({ children: [ui.text("Product A — $10")] }),
                ui.listItem({ children: [ui.text("Product B — $12")] }),
              ]),
            ],
          }),
        };
      },
    }),
  },

  // The brain receives events and returns the next action to run.
  brain: async function* (event) {
    if (event.type === "text") {
      return { action: "searchProducts", params: { query: event.data?.content } };
    }
  },
});
```

### 2) Serve it (Hono adapter)

```ts
import { Hono } from "hono";
import { handle } from "melony/adapters/hono";
import { assistant } from "./assistant";

const app = new Hono();
app.post("/api/chat", handle(assistant));
```

### 3) Stream from the client

```ts
import { MelonyClient } from "melony/client";

const client = new MelonyClient({
  url: "/api/chat"
});

for await (const event of client.sendEvent({
  type: "text",
  role: "user",
  data: { content: "running shoes" },
})) {
  console.log("event:", event);
}
```

## Core concepts

- **Event**: the universal unit of streaming.
- **Action**: an async generator that yields events and (optionally) returns a `NextAction`.
- **Brain**: an async generator that decides the next action to run based on incoming events/results.
- **Plugins/Hooks**: intercept runs, actions, and events (great place for HITL, logging, persistence).

## SDUI (Server‑Driven UI)

Melony ships a typed UI contract and builder:

- `ui.card(...)`, `ui.form(...)`, `ui.button(...)`, etc.
- Put the resulting `UINode` into `event.ui`
- `@melony/react` renders it automatically

## License

MIT
