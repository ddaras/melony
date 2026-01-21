# Server-Driven UI (SDUI)

Melony's standout feature is its built-in support for Server-Driven UI. This allows your agent to decide not just *what* to say, but *how* it should look.

## Why SDUI?

- **Real-time Updates**: Change the UI as the agent works (e.g., showing a progress bar, then a result card).
- **Interactive**: Send buttons, forms, and lists that can trigger further actions on the server.
- **Consistency**: Centralize your UI logic on the server while keeping the frontend thin.

## The `ui` Builder

Melony provides a typed `ui` builder to create UI trees easily.

```typescript
import { ui } from "melony";

const card = ui.card({
  title: "Order Details",
  children: [
    ui.text("1x Espresso - $4.00"),
    ui.text("1x Croissant - $3.50"),
    ui.divider(),
    ui.row({
      children: [
        ui.button({ label: "Cancel", action: "cancelOrder", variant: "outline" }),
        ui.button({ label: "Confirm", action: "confirmOrder" }),
      ]
    })
  ]
});
```

When you yield an event with this UI, Melony sends a JSON representation to the client.

```typescript
yield {
  type: "ui",
  ui: card
};
```

## Rendering with `@melony/react`

Rendering SDUI on the client is seamless with our React package.

```tsx
import { MelonyProvider, Thread } from "@melony/react";

function App() {
  return (
    <MelonyProvider url="/api/chat">
      <div className="h-screen w-full">
        {/* The Thread component automatically renders Text and SDUI events */}
        <Thread />
      </div>
    </MelonyProvider>
  );
}
```

### Customizing Components

You can override the default SDUI components or add your own by providing a `components` map to the provider.

```tsx
<MelonyProvider 
  url="/api/chat"
  components={{
    card: ({ title, children }) => (
      <div className="my-custom-card">
        <h1>{title}</h1>
        {children}
      </div>
    )
  }}
>
  ...
</MelonyProvider>
```

## Available UI Elements

The standard `ui` builder includes:
- **Layout**: `card`, `row`, `col`, `list`, `listItem`, `spacer`, `divider`.
- **Display**: `text`, `heading`, `badge`, `icon`, `image`.
- **Interaction**: `button`, `form`, `input`, `select`, `checkbox`, `textarea`.
- **Feedback**: `loading`, `error`.
