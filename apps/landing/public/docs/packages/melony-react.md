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

## API Reference

### `MelonyProvider`

The core context provider that distributes the Melony client and state to your component tree.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `client`<span class="required-asterisk">*</span> | - | The `MelonyClient` instance. |
| `children`<span class="required-asterisk">*</span> | - | React component tree. |
| `initialEvents` | - | Initial list of events. |
| `aggregationOptions` | - | Options for message grouping. |
| `handlers` | - | Custom per-event handlers. |

---

### `useMelony()`

React hook to access the current agent state, messages, and dispatch actions.

---

### `convertEventsToAggregatedMessages(...)`

Utility to transform raw Melony events into user-friendly message objects.

**Events**

`@melony/react` does not introduce runtime event types; it consumes and aggregates events from your Melony client.

## Types & Interfaces

- `MelonyProviderProps`
- `AggregateOptions`
