# @melony/react

React UI + providers/hooks for building chat experiences on top of **Melony’s event stream**.

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
  const { send, streaming } = useMelony();
  return (
    <button
      disabled={streaming}
      onClick={() =>
        send({ type: "text", data: { content: "Hello!" } })
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
  - Exposes `messages`, `events`, `streaming`, `error`, and `send()`.

## Event Stream & UI

Melony React provides the foundation for building interactive agent UIs. It automatically aggregates raw events into `messages` for easy rendering of chat interfaces.

```tsx
const { messages } = useMelony();

return (
  <div>
    {messages.map(message => (
      <div key={message.runId} className={message.role}>
        {message.content.map(event => {
          if (event.type === "assistant:text-delta") {
             return <span key={event.id}>{event.data.delta}</span>;
          }
          if (event.type === "ui") {
             return <MyCustomUI key={event.id} {...event.data} />;
          }
          return null;
        })}
      </div>
    ))}
  </div>
);
```

You can still access raw `events` if you need lower-level control.

## Development

```bash
pnpm build
pnpm dev
pnpm typecheck
pnpm clean
```
