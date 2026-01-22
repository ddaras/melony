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
  - Exposes `events`, `isLoading`, `error`, and `sendEvent()`.

## Event Stream & UI

Melony React provides the foundation for building interactive agent UIs. You can listen to the event stream via `useMelony()` and render your own components based on the event types.

```tsx
const { events } = useMelony();

return (
  <div>
    {events.map(event => {
      if (event.type === "text") return <Text key={event.id} content={event.data.content} />;
      if (event.type === "custom-ui") return <MyCustomUI key={event.id} {...event.data} />;
      return null;
    })}
  </div>
);
```

## Development

```bash
pnpm build
pnpm dev
pnpm typecheck
pnpm clean
```
