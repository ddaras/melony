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
```melony
component: Card
props:
  title: User Profile
  subtitle: Account Information
children:
  - component: Text
    props:
      value: "Name: John Doe"
  - component: Text
    props:
      value: "Email: john@example.com"
  - component: Button
    props:
      value: Edit Profile
      variant: primary
```

### Horizontal Layout with Row

```tsx
```melony
component: Card
props:
  title: Dashboard
children:
  - component: Row
    props:
      gap: lg
      align: center
      justify: between
    children:
      - component: Text
        props:
          value: Total Sales
          weight: semibold
      - component: Badge
        props:
          value: $12,345
          variant: success
  - component: Divider
  - component: Row
    props:
      gap: md
    children:
      - component: Icon
        props:
          name: Info
          color: primary
      - component: Text
        props:
          value: 24 active users
```

### Interactive Form

```tsx
```melony
component: Card
props:
  title: Contact Us
children:
  - component: Form
    props:
      onSubmitAction:
        action: submit-contact
        payload: {}
    children:
      - component: Input
        props:
          name: name
          label: Name
          placeholder: Your name
      - component: Input
        props:
          name: email
          inputType: email
          label: Email
          placeholder: your@email.com
      - component: Textarea
        props:
          name: message
          label: Message
          placeholder: Your message
          rows: 4
      - component: Button
        props:
          value: Send Message
          variant: primary
```

### Validation Rules

- ✅ **Valid** - Card as root with children
- ✅ **Valid** - Nested Row/Col for layout control
- ✅ **Valid** - Multiple levels of nesting
- ❌ **Invalid** - Row or Col as root
- ❌ **Invalid** - No Card wrapper
- ❌ **Invalid** - Multiple root components

## API Reference

### `MelonyMarkdown`

Component for rendering markdown with embedded Melony components using YAML syntax.

```tsx
import { MelonyMarkdown } from "melony";

function Chat() {
  const markdown = `
```melony
{
  "component": "Card",
  "props": {
    "title": "Welcome",
    "subtitle": "Get started"
  },
  "children": [
    {"component": "Text", "props": {"value": "Hello, World!", "size": "lg", "weight": "semibold"}},
    {"component": "Button", "props": {"value": "Click me", "variant": "primary"}}
  ]
}
```
  `;

  return <MelonyMarkdown>{markdown}</MelonyMarkdown>;
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `children` | `string` | Markdown content with embedded Melony components |
| `onAction` | `ActionHandler` | Handler for component actions |
| `theme` | `Partial<MelonyTheme>` | Custom theme overrides |
| `components` | `Partial<Components>` | Custom markdown components |
| `className` | `string` | CSS class name |
| `style` | `React.CSSProperties` | Inline styles |

**Features:**
- ✅ **Streaming-safe** - Handles incomplete components during streaming with "Composing..." indicator
- ✅ **Delimited blocks** - Uses ````melony` ... ````` delimiters for reliable parsing
- ✅ **JSON syntax** - Define components using simple, valid JSON
- ✅ **No MDX complexity** - Pure JSON parsing, no JSX or MDX dependencies
- ✅ **GFM support** - Full GitHub Flavored Markdown rendering

**JSON Component Example:**

```tsx
const markdown = `
```melony
{
  "component": "Card",
  "props": {"title": "Actions"},
  "children": [
    {
      "component": "ListItem",
      "props": {
        "onClickAction": {"action": "navigate", "payload": {"path": "/profile"}}
      },
      "children": [
        {"component": "Icon", "props": {"name": "Info"}},
        {"component": "Text", "props": {"value": "Go to Profile"}}
      ]
    },
    {
      "component": "Button",
      "props": {
        "value": "Submit",
        "onClickAction": {"action": "submit", "payload": {"confirm": true}}
      }
    }
  ]
}
```
`;

<MelonyMarkdown onAction={handleAction}>{markdown}</MelonyMarkdown>
```

### `MelonyCard`

The main component for rendering AI responses with embedded UI components (JSON format).

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

Components must be wrapped in ````melony` ... ````` delimiters:

```tsx
import { BLOCK_START, BLOCK_END } from "melony";

console.log(BLOCK_START); // "```melony:"
console.log(BLOCK_END);   // "```"
```

This distinguishes UI components from regular JSON in text:

```
Here's some data: {"foo": "bar"}  ← Renders as text

```melony
{"component": "Card", "props": {"title": "Hello"}}  ← Renders as component
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
```melony
{
  "component": "Card",
  "props": {"title": "Actions Demo"},
  "children": [
    {
      "component": "Button",
      "props": {
        "value": "Click Me",
        "onClickAction": {
          "action": "button-click",
          "payload": {"id": "123", "source": "demo"}
        }
      }
    },
    {
      "component": "Form",
      "props": {
        "onSubmitAction": {"action": "submit-form", "payload": {}}
      },
      "children": [
        {"component": "Input", "props": {"name": "email", "placeholder": "Email"}},
        {"component": "Button", "props": {"value": "Submit", "variant": "primary"}}
      ]
    }
  ]
}
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
```melony
{"component": "Card", "props": {"title": "Hello"}}
```

// Incomplete block → Shows loading indicator
```melony
{"component": "Card", "props": {"tit

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
```melony
{
  "component": "Card",
  "children": [
    {
      "component": "Row",
      "props": {"gap": "md"},
      "children": [
        {"component": "Icon", "props": {"name": "Check", "size": "lg", "color": "primary"}},
        {"component": "Icon", "props": {"name": "Info", "size": "md", "color": "secondary"}},
        {"component": "Icon", "props": {"name": "X", "size": "sm"}}
      ]
    }
  ]
}
```

## Real-World Examples

### Weather Dashboard

```tsx
```melony
{
  "component": "Card",
  "props": {
    "title": "San Francisco, CA",
    "subtitle": "Current Weather"
  },
  "children": [
    {
      "component": "Row",
      "props": {"gap": "lg", "align": "center"},
      "children": [
        {"component": "Icon", "props": {"name": "Check", "size": "lg", "color": "warning"}},
        {
          "component": "Col",
          "props": {"gap": "sm"},
          "children": [
            {"component": "Text", "props": {"value": "68°F", "size": "xxl", "weight": "bold"}},
            {"component": "Text", "props": {"value": "Partly Cloudy", "color": "secondary"}}
          ]
        }
      ]
    },
    {"component": "Divider"},
    {
      "component": "Row",
      "props": {"gap": "md", "justify": "between"},
      "children": [
        {
          "component": "Col",
          "props": {"gap": "xs"},
          "children": [
            {"component": "Text", "props": {"value": "Humidity", "size": "sm", "color": "secondary"}},
            {"component": "Text", "props": {"value": "65%", "weight": "semibold"}}
          ]
        },
        {
          "component": "Col",
          "props": {"gap": "xs"},
          "children": [
            {"component": "Text", "props": {"value": "Wind", "size": "sm", "color": "secondary"}},
            {"component": "Text", "props": {"value": "12 mph", "weight": "semibold"}}
          ]
        },
        {
          "component": "Col",
          "props": {"gap": "xs"},
          "children": [
            {"component": "Text", "props": {"value": "Pressure", "size": "sm", "color": "secondary"}},
            {"component": "Text", "props": {"value": "30.12 in", "weight": "semibold"}}
          ]
        }
      ]
    }
  ]
}
```

### User Profile Form

```tsx
```melony
{
  "component": "Card",
  "props": {
    "title": "Edit Profile",
    "subtitle": "Update your account information"
  },
  "children": [
    {
      "component": "Form",
      "props": {
        "onSubmitAction": {"action": "update-profile", "payload": {}}
      },
      "children": [
        {
          "component": "Row",
          "props": {"gap": "md"},
          "children": [
            {
              "component": "Col",
              "props": {"flex": 1, "gap": "sm"},
              "children": [
                {"component": "Input", "props": {"name": "firstName", "label": "First Name", "defaultValue": "John"}}
              ]
            },
            {
              "component": "Col",
              "props": {"flex": 1, "gap": "sm"},
              "children": [
                {"component": "Input", "props": {"name": "lastName", "label": "Last Name", "defaultValue": "Doe"}}
              ]
            }
          ]
        },
        {"component": "Input", "props": {"name": "email", "inputType": "email", "label": "Email", "defaultValue": "john@example.com"}},
        {"component": "Textarea", "props": {"name": "bio", "label": "Bio", "rows": 4, "placeholder": "Tell us about yourself..."}},
        {"component": "Checkbox", "props": {"name": "notifications", "label": "Receive email notifications", "defaultChecked": true}},
        {
          "component": "Row",
          "props": {"gap": "md", "justify": "end"},
          "children": [
            {"component": "Button", "props": {"value": "Cancel", "variant": "secondary"}},
            {"component": "Button", "props": {"value": "Save Changes", "variant": "primary"}}
          ]
        }
      ]
    }
  ]
}
```

### Product List

```tsx
```melony
{
  "component": "Card",
  "props": {"title": "Featured Products"},
  "children": [
    {
      "component": "List",
      "children": [
        {
          "component": "ListItem",
          "props": {"orientation": "horizontal", "gap": "md"},
          "children": [
            {"component": "Image", "props": {"src": "/product1.jpg", "alt": "Product 1", "size": "sm"}},
            {
              "component": "Col",
              "props": {"flex": 1, "gap": "xs"},
              "children": [
                {"component": "Text", "props": {"value": "Wireless Headphones", "weight": "semibold"}},
                {"component": "Text", "props": {"value": "Premium sound quality", "size": "sm", "color": "secondary"}}
              ]
            },
            {"component": "Badge", "props": {"value": "$199", "variant": "primary"}}
          ]
        },
        {
          "component": "ListItem",
          "props": {"orientation": "horizontal", "gap": "md"},
          "children": [
            {"component": "Image", "props": {"src": "/product2.jpg", "alt": "Product 2", "size": "sm"}},
            {
              "component": "Col",
              "props": {"flex": 1, "gap": "xs"},
              "children": [
                {"component": "Text", "props": {"value": "Smart Watch", "weight": "semibold"}},
                {"component": "Text", "props": {"value": "Track your fitness", "size": "sm", "color": "secondary"}}
              ]
            },
            {"component": "Badge", "props": {"value": "$299", "variant": "primary"}}
          ]
        }
      ]
    }
  ]
}
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
