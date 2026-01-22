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
import { MelonyProvider, useMelony } from "@melony/react";

const client = new MelonyClient({ url: "/api/chat" });

function App() {
  return (
    <MelonyProvider client={client}>
      <Chat />
    </MelonyProvider>
  );
}

function Chat() {
  const { events } = useMelony();
  
  return (
    <div>
      {events.map((event, i) => {
        if (event.type === "ui") {
          return <UIRenderer key={i} node={event.data} />;
        }
        // ...
      })}
    </div>
  );
}
```

### Building a UI Renderer

Since Melony is unopinionated, you should build a renderer that maps your SDUI contract to your own components. Here's a simple example:

```tsx
function UIRenderer({ node }) {
  const { type, props, children } = node;
  
  const components = {
    card: MyCard,
    button: MyButton,
    text: MyText,
    // ...
  };
  
  const Component = components[type] || 'div';
  
  return (
    <Component {...props}>
      {children?.map((child, i) => (
        <UIRenderer key={i} node={child} />
      ))}
    </Component>
  );
}
```

## Available UI Elements

While you can define any contract, the pattern used in our demo applications includes these component types:

**Layout**: `card`, `row`, `col`, `box`, `list`, `listItem`, `spacer`, `divider`

**Display**: `text`, `heading`, `badge`, `icon`, `image`, `video`, `chart`

**Interaction**: `button`, `form`, `input`, `select`, `checkbox`, `textarea`, `radioGroup`, `colorPicker`, `upload`

**Utility**: `float`, `dropdown`, `hidden`, `label`

See `@melony/react` for the complete UI contract and supported properties.
