# Server-Driven UI (SDUI)

Melony's standout feature is its built-in support for Server-Driven UI. This allows your agent to decide not just *what* to say, but *how* it should look.

## Why SDUI?

- **Real-time Updates**: Change the UI as the agent works (e.g., showing a progress bar, then a result card).
- **Interactive**: Send buttons, forms, and lists that can trigger further actions on the server.
- **Consistency**: Centralize your UI logic on the server while keeping the frontend thin.

## SDUI Structure

SDUI in Melony uses typed JSON structures that follow the UI contract defined in `@melony/react`.

```typescript
const card = {
  type: "card",
  title: "Order Details",
  children: [
    { type: "text", value: "1x Espresso - $4.00" },
    { type: "text", value: "1x Croissant - $3.50" },
    { type: "divider" },
    {
      type: "row",
      gap: "md",
      children: [
        {
          type: "button",
          label: "Cancel",
          variant: "outline",
          onClickAction: { type: "cancel-order", data: {} }
        },
        {
          type: "button",
          label: "Confirm",
          variant: "success",
          onClickAction: { type: "confirm-order", data: {} }
        },
      ],
    },
  ],
};
```

To send UI to the client, yield an event with the UI node in `data`:

```typescript
yield { type: "ui", data: card };
```

## Rendering with `@melony/react`

Rendering SDUI on the client is seamless with our React package.

```bash
npm install @melony/react
```

```tsx
import { MelonyProvider, Thread } from "@melony/react";

function App() {
  return (
    <MelonyProvider url="/api/chat">
      <Thread />
    </MelonyProvider>
  );
}
```

The `Thread` component automatically renders Text and SDUI events.

### Customizing Components

You can override the default SDUI components or add your own by providing a `components` map.

```tsx
<MelonyProvider
  url="/api/chat"
  components={{
    card: ({ title, children }) => (
      <div className="my-custom-card">
        <h1>{title}</h1>
        {children}
      </div>
    ),
  }}
>
  ...
</MelonyProvider>
```

## Available UI Elements

The SDUI protocol supports these component types:

**Layout**: `card`, `row`, `col`, `box`, `list`, `listItem`, `spacer`, `divider`

**Display**: `text`, `heading`, `badge`, `icon`, `image`, `video`, `chart`

**Interaction**: `button`, `form`, `input`, `select`, `checkbox`, `textarea`, `radioGroup`, `colorPicker`, `upload`

**Utility**: `float`, `dropdown`, `hidden`, `label`

See `@melony/react` for the complete UI contract and supported properties.
