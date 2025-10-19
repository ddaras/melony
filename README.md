# Melony

**Generate React UIs from AI responses in real-time.**  
No tool calling latency. No completion waiting. Just smooth, progressive rendering as the AI thinks.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- ⚡ **Zero Latency** - Components render progressively during streaming
- 🎯 **Smart Parsing** - Identifies component JSON with delimited blocks
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

Melony comes with 20+ built-in components that work out of the box. Just add the system prompt to your AI and start generating UIs:

```tsx
import { MelonyCard } from "melony";
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
    <MelonyCard key={message.id} text={message.content} />
  ));
}
```

The AI will automatically generate UIs using the built-in components:

```
:::melony:v1
{
  "type": "Card",
  "title": "Weather Update",
  "children": [
    {"type": "Text", "value": "Current conditions in New York"},
    {"type": "Row", "gap": "md", "children": [
      {"type": "Text", "value": "72°F", "size": "xl", "weight": "bold"},
      {"type": "Badge", "value": "Sunny", "color": "warning"}
    ]}
  ]
}
:::
```

That's it! No schema definitions, no component mapping, no configuration.

## Built-in Components

Melony includes 20+ production-ready components:

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

**Important:** All Melony UIs must start with a `Card` component as the root. The Card automatically lays out its children vertically.

### Basic Example

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "User Profile",
  "subtitle": "Account Information",
  "children": [
    {"type": "Text", "value": "Name: John Doe"},
    {"type": "Text", "value": "Email: john@example.com"},
    {"type": "Button", "value": "Edit Profile", "variant": "primary"}
  ]
}
:::
```

### Horizontal Layout with Row

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "Dashboard",
  "children": [
    {"type": "Row", "gap": "lg", "align": "center", "justify": "between", "children": [
      {"type": "Text", "value": "Total Sales", "weight": "semibold"},
      {"type": "Badge", "value": "$12,345", "color": "success"}
    ]},
    {"type": "Divider"},
    {"type": "Row", "gap": "md", "children": [
      {"type": "Icon", "name": "user", "color": "primary"},
      {"type": "Text", "value": "24 active users"}
    ]}
  ]
}
:::
```

### Interactive Form

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "Contact Us",
  "children": [
    {"type": "Form", "action": {"action": "submit-contact", "payload": {}}, "children": [
      {"type": "Label", "value": "Name", "htmlFor": "name"},
      {"type": "Input", "name": "name", "placeholder": "Your name"},
      {"type": "Label", "value": "Email", "htmlFor": "email"},
      {"type": "Input", "name": "email", "type": "email", "placeholder": "your@email.com"},
      {"type": "Label", "value": "Message", "htmlFor": "message"},
      {"type": "Textarea", "name": "message", "placeholder": "Your message", "rows": 4},
      {"type": "Button", "value": "Send Message", "type": "submit", "variant": "primary"}
    ]}
  ]
}
:::
```

### Validation Rules

- ✅ **Valid** - Card as root with children
- ✅ **Valid** - Nested Row/Col for layout control
- ✅ **Valid** - Multiple levels of nesting
- ❌ **Invalid** - Row or Col as root
- ❌ **Invalid** - No Card wrapper
- ❌ **Invalid** - Multiple root components

## API Reference

### `MelonyCard`

The main component for rendering AI responses with embedded UI components.

```tsx
import { MelonyCard } from "melony";

<MelonyCard
  text={streamingContent}
  onAction={handleAction}
  theme={customTheme}
  markdown={{ component: CustomMarkdown, props: {} }}
  loadingComponent={CustomLoader}
  disableMarkdown={false}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | AI response text (can contain streaming component JSON) |
| `onAction` | `ActionHandler` | Handler for component actions (button clicks, form submissions) |
| `theme` | `Partial<MelonyTheme>` | Custom theme overrides |
| `markdown` | `{ component, props }` | Custom markdown component |
| `loadingComponent` | `React.ComponentType` | Custom loading indicator for incomplete components |
| `disableMarkdown` | `boolean` | Disable markdown rendering (render plain text) |

### Component Delimiters

Components must be wrapped in `:::melony:v1` ... `:::` delimiters:

```tsx
import { BLOCK_START, BLOCK_END } from "melony";

console.log(BLOCK_START); // ":::melony:"
console.log(BLOCK_END);   // ":::"
```

This distinguishes UI components from regular JSON in text:

```
Here's some data: {"foo": "bar"}  ← Renders as text

:::melony:v1
{"type": "Card", "title": "Hello"}  ← Renders as component
:::
```

### Theme System

Customize the appearance of built-in components:

```tsx
import { MelonyCard } from "melony";

const customTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    success: "#10b981",
    danger: "#ef4444",
  },
  spacing: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      sm: "12px",
      md: "14px",
      lg: "16px",
    },
  },
};

<MelonyCard text={content} theme={customTheme} />
```

**Theme Structure:**

```tsx
interface MelonyTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    danger?: string;
    warning?: string;
    info?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    mutedForeground?: string;
    border?: string;
    cardBackground?: string;
    cardBorder?: string;
    inputBackground?: string;
    inputBorder?: string;
    inputFocus?: string;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    xxl?: string;
  };
  radius?: {
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string; xxl?: string; };
    fontWeight?: { normal?: number; medium?: number; semibold?: number; bold?: number; };
  };
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}
```

### Action System

Handle user interactions from built-in components:

```tsx
import { MelonyCard } from "melony";

function Chat() {
  const handleAction = async (action: string, payload?: Record<string, any>) => {
    console.log("Action:", action, "Payload:", payload);
    
    // Handle different actions
    switch (action) {
      case "submit-form":
        await saveFormData(payload);
        break;
      case "button-click":
        await performAction(payload);
        break;
      case "navigate":
        router.push(payload.url);
        break;
    }
  };
  
  return (
    <MelonyCard 
      text={content}
      onAction={handleAction}
    />
  );
}
```

Components can trigger actions:

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "Actions Demo",
  "children": [
    {"type": "Button", "value": "Click Me", "action": {
      "action": "button-click",
      "payload": {"id": "123", "source": "demo"}
    }},
    {"type": "Form", "action": {"action": "submit-form"}, "children": [
      {"type": "Input", "name": "email", "placeholder": "Email"},
      {"type": "Button", "value": "Submit", "type": "submit"}
    ]}
  ]
}
:::
```

### Server-Side Utilities

```tsx
import { MELONY_UI_GUIDE } from "melony/server";
```

**`MELONY_UI_GUIDE`** - Comprehensive system prompt that teaches LLMs how to use all built-in Melony components. Include this in your AI's system message to enable automatic UI generation.

```tsx
// app/api/chat/route.ts
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
```

The system prompt includes:
- Component syntax and delimited block format
- All 20+ component specifications with props
- Usage examples and best practices
- Composition rules (Card as root, etc.)
- Action system documentation

You can also extend it with your own instructions:

```tsx
const result = streamText({
  model: openai("gpt-4"),
  system: `${MELONY_UI_GUIDE}

## Additional Guidelines
- Always use friendly, conversational language
- Include icons in cards when relevant
- Use badges to highlight important numbers`,
  messages,
});
```

## Complete Example

Here's a full example with a Next.js App Router chat interface:

```tsx
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { MELONY_UI_GUIDE } from "melony/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: `${MELONY_UI_GUIDE}

You're a helpful assistant that creates beautiful, interactive UIs.
Use cards, forms, and layouts to make information easy to understand.`,
    messages,
  });

  return result.toDataStreamResponse();
}

// app/chat/page.tsx
"use client";

import { useChat } from "ai/react";
import { MelonyCard } from "melony";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  });

  const handleAction = async (action: string, payload?: any) => {
    console.log("Action triggered:", action, payload);
    
    switch (action) {
      case "submit-form":
        // Handle form submission
        alert(`Form submitted: ${JSON.stringify(payload)}`);
        break;
      case "button-click":
        // Handle button click
        console.log("Button clicked:", payload);
        break;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-lg px-4 py-2"
                  : ""
              }`}
            >
              {message.role === "assistant" ? (
                <MelonyCard
                  text={message.content}
                  onAction={handleAction}
                  theme={{
                    colors: {
                      primary: "#3b82f6",
                      success: "#10b981",
                    },
                  }}
                />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

## How It Works

1. **AI Streams Response** - Your LLM streams text and component JSON
2. **Progressive Parsing** - Melony identifies complete component blocks as they arrive
3. **Instant Rendering** - Components render immediately when blocks are complete
4. **Markdown Fallback** - Text outside component blocks renders as markdown
5. **Action Handling** - User interactions trigger your action handler

### Parser Behavior

```typescript
// Complete component block → Renders component
:::melony:v1
{"type": "Card", "title": "Hello"}
:::

// Incomplete block → Shows loading indicator
:::melony:v1
{"type": "Card", "tit

// Regular JSON → Renders as plain text
Here's some data: {"key": "value"}

// Markdown → Renders with markdown formatting
# Heading
- List item
**Bold text**
```

## Advanced Usage

### Custom Markdown Component

```tsx
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

<MelonyCard
  text={content}
  markdown={{
    component: ReactMarkdown,
    props: {
      components: {
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter language={match[1]} {...props}>
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      },
    },
  }}
/>
```

### Custom Loading Component

```tsx
const MyLoader = () => (
  <div className="flex items-center gap-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
    <span className="text-sm text-gray-500">Generating UI...</span>
  </div>
);

<MelonyCard
  text={content}
  loadingComponent={MyLoader}
/>
```

### Dark Mode Theme

```tsx
const darkTheme = {
  colors: {
    primary: "#60a5fa",
    secondary: "#94a3b8",
    success: "#34d399",
    danger: "#f87171",
    background: "#0f172a",
    foreground: "#f1f5f9",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    border: "#334155",
    cardBackground: "#1e293b",
    cardBorder: "#334155",
    inputBackground: "#0f172a",
    inputBorder: "#475569",
  },
};

<MelonyCard text={content} theme={darkTheme} />
```

## TypeScript Support

Melony is written in TypeScript with full type definitions:

```tsx
import type { 
  MelonyCardProps,
  MelonyTheme,
  ActionHandler,
  ComponentData,
  ParsedSegment,
} from "melony";

import type {
  CardProps,
  ButtonProps,
  InputProps,
  FormProps,
  RowProps,
  ColProps,
  // ... all component prop types
} from "melony";
```

## Icons

Built-in Icon component with 30+ icons:

**Available Icons:**
- Navigation: `home`, `menu`, `chevronUp`, `chevronDown`, `chevronLeft`, `chevronRight`
- User: `user`, `mail`, `phone`, `lock`, `unlock`
- Actions: `search`, `edit`, `trash`, `download`, `upload`, `plus`, `minus`, `check`, `x`
- UI: `settings`, `bell`, `heart`, `star`, `eye`, `eyeOff`, `info`, `warning`, `error`, `success`
- Other: `calendar`, `clock`, `location`

```tsx
:::melony:v1
{
  "type": "Card",
  "children": [
    {"type": "Row", "gap": "md", "children": [
      {"type": "Icon", "name": "home", "size": "lg", "color": "primary"},
      {"type": "Icon", "name": "user", "size": "md", "color": "secondary"},
      {"type": "Icon", "name": "settings", "size": "sm", "color": "muted"}
    ]}
  ]
}
:::
```

## Real-World Examples

### Weather Dashboard

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "San Francisco, CA",
  "subtitle": "Current Weather",
  "children": [
    {"type": "Row", "gap": "lg", "align": "center", "children": [
      {"type": "Icon", "name": "success", "size": "xl", "color": "warning"},
      {"type": "Col", "gap": "sm", "children": [
        {"type": "Text", "value": "68°F", "size": "xxl", "weight": "bold"},
        {"type": "Text", "value": "Partly Cloudy", "color": "mutedForeground"}
      ]}
    ]},
    {"type": "Divider"},
    {"type": "Row", "gap": "md", "justify": "between", "children": [
      {"type": "Col", "gap": "xs", "children": [
        {"type": "Text", "value": "Humidity", "size": "sm", "color": "mutedForeground"},
        {"type": "Text", "value": "65%", "weight": "semibold"}
      ]},
      {"type": "Col", "gap": "xs", "children": [
        {"type": "Text", "value": "Wind", "size": "sm", "color": "mutedForeground"},
        {"type": "Text", "value": "12 mph", "weight": "semibold"}
      ]},
      {"type": "Col", "gap": "xs", "children": [
        {"type": "Text", "value": "Pressure", "size": "sm", "color": "mutedForeground"},
        {"type": "Text", "value": "30.12 in", "weight": "semibold"}
      ]}
    ]}
  ]
}
:::
```

### User Profile Form

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "Edit Profile",
  "subtitle": "Update your account information",
  "children": [
    {"type": "Form", "action": {"action": "update-profile"}, "children": [
      {"type": "Row", "gap": "md", "children": [
        {"type": "Col", "flex": 1, "gap": "sm", "children": [
          {"type": "Label", "value": "First Name"},
          {"type": "Input", "name": "firstName", "value": "John"}
        ]},
        {"type": "Col", "flex": 1, "gap": "sm", "children": [
          {"type": "Label", "value": "Last Name"},
          {"type": "Input", "name": "lastName", "value": "Doe"}
        ]}
      ]},
      {"type": "Label", "value": "Email"},
      {"type": "Input", "name": "email", "type": "email", "value": "john@example.com"},
      {"type": "Label", "value": "Bio"},
      {"type": "Textarea", "name": "bio", "rows": 4, "placeholder": "Tell us about yourself..."},
      {"type": "Label", "value": "Notifications"},
      {"type": "Checkbox", "name": "notifications", "label": "Receive email notifications", "checked": true},
      {"type": "Row", "gap": "md", "justify": "end", "children": [
        {"type": "Button", "value": "Cancel", "variant": "ghost"},
        {"type": "Button", "value": "Save Changes", "type": "submit", "variant": "primary"}
      ]}
    ]}
  ]
}
:::
```

### Product List

```tsx
:::melony:v1
{
  "type": "Card",
  "title": "Featured Products",
  "children": [
    {"type": "List", "children": [
      {"type": "ListItem", "orientation": "horizontal", "children": [
        {"type": "Image", "src": "/product1.jpg", "alt": "Product 1", "size": "sm"},
        {"type": "Col", "flex": 1, "gap": "xs", "children": [
          {"type": "Text", "value": "Wireless Headphones", "weight": "semibold"},
          {"type": "Text", "value": "Premium sound quality", "size": "sm", "color": "mutedForeground"}
        ]},
        {"type": "Badge", "value": "$199", "color": "primary"}
      ]},
      {"type": "ListItem", "orientation": "horizontal", "children": [
        {"type": "Image", "src": "/product2.jpg", "alt": "Product 2", "size": "sm"},
        {"type": "Col", "flex": 1, "gap": "xs", "children": [
          {"type": "Text", "value": "Smart Watch", "weight": "semibold"},
          {"type": "Text", "value": "Track your fitness", "size": "sm", "color": "mutedForeground"}
        ]},
        {"type": "Badge", "value": "$299", "color": "primary"}
      ]}
    ]}
  ]
}
:::
```

## Examples & Templates

Check out the example apps in the repository:

- **generative-ui-template** - Full chat interface with Melony
- **assistant-ui-x-melony** - Integration with assistant-ui library

## Performance

- **Zero Latency** - Components render as soon as complete blocks are parsed
- **Progressive** - No waiting for full response completion
- **Efficient** - Minimal re-renders with memoization
- **Lightweight** - Small bundle size, tree-shakeable

## Browser Support

Melony works in all modern browsers that support React 18+:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Migration from v1.6

If you were using custom components with Zod schemas in v1.6:

**Before (v1.6):**
```tsx
import { zodSchemaToPrompt } from "melony/zod";
const prompt = zodSchemaToPrompt({ schema, type: "weather" });
```

**After (v1.7+):**
Built-in components replace the need for custom schemas. Use the `MELONY_UI_GUIDE` and compose UIs with built-in components instead.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Melony](https://github.com/ddaras/melony)

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [npm Package](https://www.npmjs.com/package/melony)
- [Issues](https://github.com/ddaras/melony/issues)
