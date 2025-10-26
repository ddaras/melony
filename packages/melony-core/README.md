# Melony

**Progressive UI generation from AI responses in real-time.**  
Stream interactive React components directly from LLMs with zero latency. No tool calling overhead. No completion waiting. Just smooth, progressive rendering as the AI thinks.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- ⚡ **Zero Latency** - Components render progressively during streaming, no tool calling overhead
- 🎯 **Smart Parsing** - Converts HTML-like widget tags to React components on the fly
- 🎨 **Built-in Components** - 20+ ready-to-use UI components (cards, forms, charts, lists, etc.)
- 🛡️ **Type Safe** - Full TypeScript support with strict typing
- 🎭 **Themeable** - Customizable colors, spacing, and typography
- 🔄 **Interactive** - Built-in action system for user interactions
- 📝 **Markdown Support** - Seamless integration with GFM (GitHub Flavored Markdown)
- 🪶 **Lightweight** - Minimal dependencies, tree-shakeable

## Installation

```bash
npm install melony
# or
pnpm add melony
# or
yarn add melony
```

## Quick Start

### 1. Add the system prompt to your AI

```tsx
import { MELONY_UI_GUIDE } from "melony/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: MELONY_UI_GUIDE, // Teaches AI to use Melony components
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. Render streaming responses with MelonyMarkdown

```tsx
"use client";
import { useChat } from "ai/react";
import { MelonyProvider, MelonyMarkdown } from "melony";

export default function Chat() {
  const { messages } = useChat({ api: "/api/chat" });

  return (
    <MelonyProvider onAction={handleAction}>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "assistant" ? (
            <MelonyMarkdown>{message.content}</MelonyMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      ))}
    </MelonyProvider>
  );
}

const handleAction = (action) => {
  console.log("Action:", action.type, action.payload);
};
```

### 3. AI generates interactive UIs automatically

The AI will stream HTML-like component tags that Melony renders in real-time:

```html
<card title="Weather Forecast">
  <row gap="md">
    <text value="San Francisco" size="lg" weight="bold" />
    <badge label="72°F" variant="success" />
  </row>
  <text value="Sunny with clear skies" />
  <button
    label="Get Detailed Forecast"
    variant="primary"
    onClickAction='{"type": "fetch-forecast", "payload": {"city": "SF"}}'
  />
</card>
```

As the AI streams this content, Melony progressively parses and renders each complete component block instantly.

## Architecture

Melony separates concerns into three main layers:

```
┌─────────────────────────────────────────────────┐
│            User Application                     │
│  (Provides theme, actions, context)             │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │ MelonyProvider │  ◄─── Top-level context provider
         └───────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────┐     ┌─────────▼────────┐
│   Melony   │     │   MelonyWidget   │
│  Markdown  │     │                  │
│            │     │  (Widget-only    │
│ (Markdown  │     │   rendering)     │
│  + Widgets)│     │                  │
└───┬────────┘     └─────────┬────────┘
    │                        │
    └────────────┬───────────┘
                 │
         ┌───────▼────────┐
         │ MelonyParser   │  ◄─── Parses HTML-like tags
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │    Renderer    │  ◄─── Renders ComponentDef
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │   Components   │  ◄─── Built-in UI components
         └────────────────┘
```

### Core Components

#### `MelonyProvider`

Top-level provider that supplies theme, action handlers, and global context to all Melony components.

```tsx
<MelonyProvider
  theme={customTheme}
  onAction={handleAction}
  widgets={customWidgets}
>
  {children}
</MelonyProvider>
```

#### `MelonyMarkdown`

Renders markdown content with embedded Melony components. Use this for AI chat responses that mix text and UI.

```tsx
<MelonyMarkdown>{aiResponse}</MelonyMarkdown>
```

#### `MelonyWidget`

Renders widget components only (no markdown). Use this for pure UI rendering.

```tsx
// From HTML-like string
<MelonyWidget>
  {"<card title='Hello'><text value='World' /></card>"}
</MelonyWidget>

// From ComponentDef object
<MelonyWidget>
  {{
    component: "Card",
    props: { title: "Hello" },
    children: [{ component: "Text", props: { value: "World" } }]
  }}
</MelonyWidget>
```

## Built-in Components

### Container

- **Card** - Root container component (all UIs must start with Card)

### Layout

- **Row** - Horizontal flex container with gap, align, justify
- **Col** - Vertical flex container with gap, align, justify
- **Box** - Generic container with flex properties
- **Spacer** - Flexible spacing element
- **Divider** - Visual separator (horizontal/vertical)
- **List** - List container
- **ListItem** - Individual list items with built-in flex layout

### Content

- **Text** - Styled text with size, color, weight options
- **Heading** - Heading text (h1-h6)
- **Image** - Images with sizing and alt text
- **Icon** - 30+ built-in icons (home, user, settings, etc.)
- **Badge** - Colored labels and tags

### Data Visualization

- **Chart** - Interactive charts (line, bar, pie, area)

### Form Components

- **Input** - Text input fields (text, email, password, number, tel, url, etc.)
- **Textarea** - Multi-line text input
- **Select** - Dropdown menus with options
- **Checkbox** - Boolean checkboxes
- **RadioGroup** - Radio button groups
- **Button** - Action buttons with variants (primary, secondary, outline, ghost)
- **Form** - Form container with submission handling
- **Label** - Form field labels

### Control Flow

- **For** - Render arrays with template support (supports context variables like `{{item}}`, `{{index}}`)
- **Widget** - Render custom widget templates

## Component Syntax

All Melony UIs use HTML-like syntax and **must start with a Card component**:

```html
<card title="User Profile">
  <row gap="md" align="center">
    <image src="https://example.com/avatar.jpg" alt="Avatar" size="md" />
    <col gap="sm">
      <text value="John Doe" size="lg" weight="bold" />
      <text value="Software Engineer" color="muted" />
    </col>
  </row>

  <divider />

  <button
    label="Edit Profile"
    variant="primary"
    onClickAction='{"type": "edit-profile", "payload": {"id": 123}}'
  />
</card>
```

### Key Syntax Rules

1. **Always start with `<card>`** - Every UI must have Card as the root element
2. **Use lowercase tag names** - `<card>`, `<text>`, `<button>`, etc.
3. **Attributes are props** - `<text value="Hello" size="lg" />`
4. **Self-closing tags supported** - `<spacer height="20" />`
5. **Nested components** - Place children between opening and closing tags
6. **No raw text children** - Wrap text in `<text>` components

## Action System

Handle user interactions with the action system:

```tsx
const handleAction = (action) => {
  const { type, payload } = action;

  switch (type) {
    case "edit-profile":
      console.log("Editing profile:", payload.id);
      break;
    case "submit-form":
      console.log("Form data:", payload);
      break;
    case "fetch-data":
      fetchData(payload.endpoint);
      break;
  }
};

<MelonyProvider onAction={handleAction}>
  {/* Your components */}
</MelonyProvider>;
```

### Action Props

Components support action props:

- `onClickAction` - Buttons, ListItems
- `onChangeAction` - Inputs, Textareas, Selects, Checkboxes, RadioGroups
- `onSubmitAction` - Forms

Actions are passed as JSON strings:

```html
<button
  label="Click Me"
  onClickAction='{"type": "button-click", "payload": {"value": 42}}'
/>

<input label="Email" onChangeAction='{"type": "email-changed"}' />

<form onSubmitAction='{"type": "form-submit"}'>
  <!-- form fields -->
</form>
```

### useAction Hook

Subscribe to specific actions in your components:

```tsx
import { useAction } from "melony";

function MyComponent() {
  useAction("button-click", (payload, action) => {
    console.log("Button clicked:", payload);
  });

  return <div>...</div>;
}
```

## Theme System

Customize the appearance of all Melony components:

```tsx
import { MelonyProvider } from "melony";

const customTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#6366f1",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    muted: "#6b7280",
    background: "#ffffff",
    foreground: "#000000",
    border: "#e5e7eb",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "24px",
    },
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};

<MelonyProvider theme={customTheme}>
  <MelonyMarkdown>{content}</MelonyMarkdown>
</MelonyProvider>;
```

## Context System

Pass custom data to components for template rendering:

```tsx
const context = {
  user: {
    name: "John Doe",
    email: "john@example.com",
  },
  isAuthenticated: true,
};

<MelonyMarkdown context={context}>{content}</MelonyMarkdown>;
```

Components can access context variables using the `For` component with templates:

```html
<card title="User List">
  <for items='[{"name": "Alice"}, {"name": "Bob"}]'>
    <text value="{{item.name}}" />
  </for>
</card>
```

## Advanced: Control Flow

### For Component

Render arrays dynamically:

```html
<card title="Task List">
  <for
    items='[{"id": 1, "task": "Buy groceries"}, {"id": 2, "task": "Walk dog"}]'
  >
    <row gap="md" align="center">
      <text value="{{index}}." />
      <text value="{{item.task}}" flex="1" />
      <badge label="{{isEven ? 'Even' : 'Odd'}}" />
    </row>
  </for>
</card>
```

Available context variables in `<for>`:

- `{{item}}` - Current array item
- `{{index}}` - Current index (0-based)
- `{{isFirst}}` - Boolean if first item
- `{{isLast}}` - Boolean if last item
- `{{isEven}}` - Boolean if even index
- `{{isOdd}}` - Boolean if odd index

## Advanced: Custom Parser

Extend the parser with custom component tags:

```tsx
import { MelonyParser } from "melony";

const parser = new MelonyParser();

// Register custom component
parser.registerComponent("mywidget", "MyWidget");

// Register multiple components
parser.registerComponents({
  customcard: "CustomCard",
  specialbutton: "SpecialButton",
});

// Use with MelonyMarkdown (via custom implementation)
// or directly parse content
const blocks = parser.parseContentAsBlocks(content);
```

## Advanced: Direct Rendering

For advanced use cases, use the renderer directly:

```tsx
import { renderComponent, ComponentDef } from "melony";

const componentDef: ComponentDef = {
  component: "Card",
  props: { title: "Hello" },
  children: [{ component: "Text", props: { value: "World" } }],
};

const element = renderComponent(componentDef);
```

## Widget Templates (Experimental)

Create reusable widget templates:

```tsx
import { WidgetTemplate } from "melony";

const weatherWidget: WidgetTemplate = {
  type: "weather",
  name: "Weather Card",
  template: `<card title="{{location}} Weather">
    <row gap="md">
      <text value="{{temperature}}°F" size="xl" weight="bold" />
      <badge label="{{condition}}" variant="primary" />
    </row>
  </card>`,
  props: [
    { name: "location", type: "string", required: true },
    { name: "temperature", type: "number", required: true },
    { name: "condition", type: "string", required: false },
  ],
};

<MelonyProvider widgets={[weatherWidget]}>
  <MelonyMarkdown>{content}</MelonyMarkdown>
</MelonyProvider>;
```

The AI can then use: `<widget type="weather" location="SF" temperature="68" condition="Sunny" />`

## Complete Example

```tsx
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { MELONY_UI_GUIDE } from "melony/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: MELONY_UI_GUIDE,
    messages,
  });

  return result.toDataStreamResponse();
}

// app/page.tsx
("use client");
import { useChat } from "ai/react";
import { MelonyProvider, MelonyMarkdown } from "melony";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const handleAction = (action) => {
    console.log("Action triggered:", action.type, action.payload);

    // Handle specific actions
    if (action.type === "fetch-weather") {
      // Fetch weather data
    }
  };

  return (
    <MelonyProvider onAction={handleAction}>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" ? (
                <MelonyMarkdown>{message.content}</MelonyMarkdown>
              ) : (
                <p className="text-gray-700">{message.content}</p>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </form>
      </div>
    </MelonyProvider>
  );
}
```

## How It Works

1. **AI Streams Response** - Your LLM streams text and HTML-like component tags
2. **Progressive Parsing** - `MelonyParser` identifies complete component blocks as they arrive
3. **Instant Rendering** - Complete blocks are immediately converted to React components
4. **Markdown Fallback** - Text outside component blocks renders as markdown
5. **Action Handling** - User interactions trigger your action handler

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  MelonyTheme,
  Action,
  ActionHandler,
  ComponentDef,
  WidgetTemplate,
} from "melony";
```

## Examples

Check out the example apps in the repository:

- **generative-ui-template** - Full chat interface with Melony components
- **assistant-ui-x-melony** - Integration with assistant-ui library

## API Reference

### MelonyProvider Props

| Prop       | Type               | Description             |
| ---------- | ------------------ | ----------------------- |
| `children` | `ReactNode`        | Child components        |
| `theme`    | `MelonyTheme`      | Custom theme overrides  |
| `onAction` | `ActionHandler`    | Action handler function |
| `widgets`  | `WidgetTemplate[]` | Custom widget templates |

### MelonyMarkdown Props

| Prop         | Type                  | Description                            |
| ------------ | --------------------- | -------------------------------------- |
| `children`   | `string`              | Markdown content with embedded widgets |
| `components` | `Partial<Components>` | Custom markdown components             |
| `context`    | `Record<string, any>` | Custom context for templates           |

### MelonyWidget Props

| Prop       | Type                     | Description                  |
| ---------- | ------------------------ | ---------------------------- |
| `children` | `string \| ComponentDef` | Widget definition            |
| `context`  | `Record<string, any>`    | Custom context for templates |

## Migration from v1.x

If you're upgrading from v1.x, note these breaking changes:

1. **Syntax change**: YAML syntax (`component: Card`) → HTML-like syntax (`<card>`)
2. **New provider**: Wrap your app with `MelonyProvider` instead of individual providers
3. **Action format**: Actions now use JSON strings instead of plain strings
4. **Component separation**: Use `MelonyMarkdown` for mixed content, `MelonyWidget` for widget-only

## License

MIT © [Melony](https://github.com/ddaras/melony)

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [npm Package](https://www.npmjs.com/package/melony)
- [Issues](https://github.com/ddaras/melony/issues)
- [Documentation](https://github.com/ddaras/melony#readme)

---

Built with ❤️ for developers building AI-powered interfaces
