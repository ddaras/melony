# @melony/react

## Purpose

`@melony/react` provides React bindings for Melony clients, including context, hooks, and message aggregation.

## Install

```bash
pnpm add @melony/react
```

## Example

```tsx
import { MelonyProvider, useMelony } from "@melony/react";

function Chat() {
  const { messages, send } = useMelony();
  return (
    <button onClick={() => send({ type: "user:text", data: { content: "Hello" } })}>
      Send
    </button>
  );
}

export function App({ client }: { client: any }) {
  return (
    <MelonyProvider client={client}>
      <Chat />
    </MelonyProvider>
  );
}
```

## Main Exports

- `MelonyProvider`
- `useMelony()`
- `convertEventsToAggregatedMessages(...)`
- `MelonyProviderProps`
- `AggregateOptions`

## Options

- `client`: required `MelonyClient` instance.
- `children`: required React tree.
- `initialEvents`: optional initial event list.
- `aggregationOptions`: optional `AggregateOptions` for message grouping.
- `eventHandlers`: optional per-event custom handlers.

## Events

`@melony/react` does not introduce runtime event types; it consumes and aggregates events from your Melony client.
