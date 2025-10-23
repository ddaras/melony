# Melony

**Generate React UIs from AI responses in real-time.**  
No tool calling latency. No completion waiting. Just smooth, progressive rendering as the AI thinks.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- ⚡ **Zero Latency** - Components render progressively during streaming
- 🎯 **Smart Parsing** - Identifies component YAML with delimited blocks
- 🎨 **Built-in Components** - 20+ ready-to-use UI components
- 🛡️ **Type Safe** - Full TypeScript support
- 🎭 **Themeable** - Customizable colors, spacing, and typography
- 🔄 **Interactive** - Built-in action system for user interactions
- 📝 **Markdown Support** - Built-in GFM rendering
- 🪶 **Lightweight** - Minimal dependencies

## Installation

```bash
npm install melony
# or
pnpm add melony
# or
yarn add melony
```

## Quick Start

```tsx
import { MelonyMarkdown } from "melony";
import { MELONY_UI_GUIDE } from "melony/server";

// 1. In your API route, add the system prompt
export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: openai("gpt-4"),
    system: MELONY_UI_GUIDE,
    messages,
  });
  
  return result.toDataStreamResponse();
}

// 2. Render streaming responses in your UI
function Chat() {
  const { messages } = useChat({ api: "/api/chat" });
  
  return messages.map((message) => (
    <MelonyMarkdown key={message.id} onAction={handleAction}>
      {message.content}
    </MelonyMarkdown>
  ));
}
```

The AI will automatically generate UIs using the built-in components:

```melony
component: Card
props:
  title: Weather Update
children:
  - component: Text
    props:
      value: Current conditions in New York
  - component: Row
    props:
      gap: md
    children:
      - component: Text
        props:
          value: 72°F
          size: xl
          weight: bold
      - component: Badge
        props:
          value: Sunny
          variant: warning
```

## Built-in Components

### Container
- **Card** - Root container component (required for all UIs)

### Layout
- **Row** - Horizontal flex container with gap, align, justify
- **Col** - Vertical flex container with gap, align, justify
- **Spacer** - Flexible spacing element
- **Divider** - Visual separator (horizontal/vertical)
- **List** - Ordered/unordered lists with items

### Content
- **Text** - Styled text with size, color, weight options
- **Heading** - Heading text (h1-h6)
- **Image** - Images with sizing and alt text
- **Icon** - 30+ built-in icons (home, user, settings, etc.)
- **Badge** - Colored labels and tags
- **Chart** - Data visualization components

### Form Components
- **Input** - Text input fields (text, email, password, number, tel, url, etc.)
- **Textarea** - Multi-line text input
- **Select** - Dropdown menus with options
- **Checkbox** - Boolean checkboxes
- **RadioGroup** - Radio button groups
- **Button** - Action buttons with variants (primary, secondary, outline, ghost)
- **Form** - Form container with submission handling
- **Label** - Form field labels

## Component Composition

**Important:** All Melony UIs must start with a `Card` component as the root.

```melony
component: Card
props:
  title: User Profile
children:
  - component: Text
    props:
      value: "Name: John Doe"
  - component: Button
    props:
      value: Edit Profile
      variant: primary
```

## API Reference

### `MelonyMarkdown`

Main component for rendering markdown with embedded Melony components.

```tsx
import { MelonyMarkdown } from "melony";

<MelonyMarkdown onAction={handleAction} theme={customTheme}>
  {markdownContent}
</MelonyMarkdown>
```

**Props:**
- `children` - Markdown content with embedded Melony components
- `onAction` - Handler for component actions
- `theme` - Custom theme overrides
- `components` - Custom markdown components
- `className` - CSS class name
- `style` - Inline styles

### Theme System

```tsx
const customTheme = {
  colors: {
    primary: "#3b82f6",
    success: "#10b981",
    danger: "#ef4444",
  },
  spacing: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
};

<MelonyMarkdown theme={customTheme}>{content}</MelonyMarkdown>
```

### Action System

Handle user interactions from components:

```tsx
const handleAction = async (action: string, payload?: Record<string, any>) => {
  switch (action) {
    case "submit-form":
      await saveFormData(payload);
      break;
    case "button-click":
      await performAction(payload);
      break;
  }
};

<MelonyMarkdown onAction={handleAction}>{content}</MelonyMarkdown>
```

### Server-Side Utilities

```tsx
import { MELONY_UI_GUIDE } from "melony/server";

// Include in your AI's system message
const result = streamText({
  model: openai("gpt-4"),
  system: MELONY_UI_GUIDE,
  messages,
});
```

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

// app/chat/page.tsx
"use client";
import { useChat } from "ai/react";
import { MelonyMarkdown } from "melony";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const handleAction = async (action: string, payload?: any) => {
    console.log("Action triggered:", action, payload);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === "assistant" ? (
              <MelonyMarkdown onAction={handleAction}>
                {message.content}
              </MelonyMarkdown>
            ) : (
              message.content
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything..."
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## How It Works

1. **AI Streams Response** - Your LLM streams text and component YAML
2. **Progressive Parsing** - Melony identifies complete component blocks as they arrive
3. **Instant Rendering** - Components render immediately when blocks are complete
4. **Markdown Fallback** - Text outside component blocks renders as markdown
5. **Action Handling** - User interactions trigger your action handler

## TypeScript Support

```tsx
import type { 
  MelonyMarkdownProps,
  MelonyTheme,
  ActionHandler,
} from "melony";
```

## Examples & Templates

Check out the example apps in the repository:
- **generative-ui-template** - Full chat interface with Melony
- **assistant-ui-x-melony** - Integration with assistant-ui library

## License

MIT © [Melony](https://github.com/ddaras/melony)

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [npm Package](https://www.npmjs.com/package/melony)
- [Issues](https://github.com/ddaras/melony/issues)