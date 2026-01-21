# @melony/react

React UI + providers/hooks for building chat experiences on top of **Melony’s event stream**, including automatic rendering for **Server‑Driven UI (SDUI)** (`event.ui`).

## Installation

```bash
npm install @melony/react melony react
```

## Quick start

```tsx
import { MelonyClient } from "melony/client";
import { MelonyProvider } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

export default function App() {
  return (
    <MelonyProvider client={client}>
      {/* Your components */}
    </MelonyProvider>
  );
}
```

### Send a message from UI

```tsx
import { useMelony } from "@melony/react";

function Controls() {
  const { sendEvent, isLoading } = useMelony();
  return (
    <button
      disabled={isLoading}
      onClick={() =>
        sendEvent({ type: "text", data: { content: "Hello!" } })
      }
    >
      Send
    </button>
  );
}
```

## Providers & hooks

- **`MelonyProvider`** + **`useMelony()`**
  - Connects to a Melony runtime endpoint.
  - Exposes `events`, `messages`, `isLoading`, `error`, and `sendEvent()`.

## SDUI (Server‑Driven UI)

If the backend yields events with `type: "ui"`, Melony React renders them automatically inside assistant messages.

Backend example:

```ts
yield {
  type: "ui",
  data: {
    type: "card",
    title: "Weather",
    children: [
      { type: "text", value: "72°F and sunny" }
    ],
  },
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
