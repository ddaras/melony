# @melony/react

React UI + providers/hooks for building chat experiences on top of **Melony’s event stream**, including automatic rendering for **Server‑Driven UI (SDUI)** (`event.ui`).

## Installation

```bash
npm install @melony/react melony react
```

## Quick start

```tsx
import React from "react";
import { MelonyClient } from "melony/client";
import { MelonyClientProvider, Thread } from "@melony/react";

const client = new MelonyClient({
  url: "/api/chat",
});

export default function App() {
  return (
    <MelonyClientProvider client={client}>
      <Thread />
    </MelonyClientProvider>
  );
}
```

### Send a message from UI

`Thread` already wires this up, but if you want manual control:

```tsx
import { useMelony } from "@melony/react";

function Controls() {
  const { sendEvent, isLoading } = useMelony();
  return (
    <button
      disabled={isLoading}
      onClick={() =>
        sendEvent({ type: "text", role: "user", data: { content: "Hello!" } })
      }
    >
      Send
    </button>
  );
}
```

## Components

- **`Thread`**: a full chat thread (composer + message list + streaming).
- **`ChatSidebar`**: a sidebar-style chat UI container.
- **`ChatFull` / `ChatPopup`**: ready-to-embed layouts (see exports).
- **`UIRenderer`**: renders SDUI `UINode` trees from `melony`.

## Providers & hooks

- **`MelonyClientProvider`** + **`useMelony()`**
  - wraps a `MelonyClient` from `melony/client`
  - exposes `events`, `messages`, `isLoading`, `error`, and `sendEvent()`

- **`ThreadProvider`** + **`useThreads()`** (optional)
  - adds “thread list / active thread” state
  - you bring a `ThreadService` (load threads, load events, delete thread, etc.)

- **`AuthProvider`** + **`useAuth()`** (optional)
  - plug in an `AuthService` (login/logout/me/token) for authenticated apps

## SDUI (Server‑Driven UI)

If the backend yields events with `event.ui`, Melony React renders them automatically inside assistant messages.

Backend example:

```ts
import { ui } from "melony";

yield {
  type: "ui",
  ui: ui.card({
    title: "Weather",
    children: [ui.text("72°F and sunny")],
  }),
};
```

Frontend: no extra work — it shows up in the message stream.

## Development

```bash
pnpm build
pnpm dev
pnpm typecheck
pnpm clean
```
