# Server-Driven UI (SDUI)

While Melony is a minimalist framework, its event-based nature makes it an excellent foundation for building Server-Driven UI (SDUI). This allows your agent to decide not just *what* to say, but *how* it should look by emitting specific UI events.

## The SDUI Pattern

The idea is simple: instead of just yielding text, your agent yields events that describe UI components.

## SDUI Structure

You can define your own UI contract. A common approach is to use typed JSON structures:

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
import { MelonyClient } from "melony/client";
import { MelonyProvider } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function App() {
  return (
    <MelonyProvider client={client}>
      {/* ... */}
    </MelonyProvider>
  );
}
```

The `Thread` component automatically renders Text and SDUI events.

### Customizing Components

You can override the default SDUI components or add your own by providing a `components` map to your UI renderer.

```tsx
<MelonyProvider client={client}>
  {/* Your chat components */}
</MelonyProvider>
```

## Available UI Elements

The SDUI protocol supports these component types:

**Layout**: `card`, `row`, `col`, `box`, `list`, `listItem`, `spacer`, `divider`

**Display**: `text`, `heading`, `badge`, `icon`, `image`, `video`, `chart`

**Interaction**: `button`, `form`, `input`, `select`, `checkbox`, `textarea`, `radioGroup`, `colorPicker`, `upload`

**Utility**: `float`, `dropdown`, `hidden`, `label`

See `@melony/react` for the complete UI contract and supported properties.
