# Melony

**Let AI generate UI widgets for you.**

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- ⚡ **AI-Composed** - LLM intelligently composes UI widgets based on context
- 🎯 **Smart Parsing** - Converts HTML-like tags to interactive components on the fly
- 🎨 **Built-in Components** - 20+ ready-to-use UI components (cards, forms, charts, etc.)
- 🛡️ **Type Safe** - Full TypeScript support
- 🔄 **Interactive** - Built-in action system for user interactions

## Installation

```bash
npm install melony
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

### 2. Render streaming responses

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

The AI streams HTML-like component tags that Melony renders in real-time:

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
  
  <button
    label="Edit Profile"
    variant="primary"
    onClickAction='{"type": "edit-profile", "payload": {"id": 123}}'
  />
</card>
```

## Built-in Components

### Layout
- **Card** - Root container (required)
- **Row/Col** - Horizontal/vertical flex containers
- **Box** - Generic container
- **List/ListItem** - List components

### Content
- **Text/Heading** - Styled text
- **Image** - Images with sizing
- **Icon** - 30+ built-in icons
- **Badge** - Colored labels

### Form Components
- **Input/Textarea** - Text inputs
- **Select** - Dropdown menus
- **Checkbox/RadioGroup** - Selection controls
- **Button** - Action buttons
- **Form** - Form containers

### Data
- **Chart** - Interactive charts (line, bar, pie, area)
- **For** - Render arrays with templates

## Action System

Handle user interactions:

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
  }
};
```

Actions are passed as JSON strings in component props:

```html
<button
  label="Click Me"
  onClickAction='{"type": "button-click", "payload": {"value": 42}}'
/>

<input 
  label="Email" 
  onChangeAction='{"type": "email-changed"}' 
/>
```

## How It Works

1. **AI Streams Response** - Your LLM streams text and HTML-like component tags
2. **Progressive Parsing** - Melony identifies complete component blocks as they arrive
3. **Instant Rendering** - Complete blocks are immediately converted to interactive components
4. **Action Handling** - User interactions trigger your action handler

## Examples

Check out the example apps in the repository:
- **generative-ui-template** - Full chat interface with Melony components
- **assistant-ui-x-melony** - Integration with assistant-ui library

## TypeScript Support

```tsx
import type {
  MelonyTheme,
  Action,
  ActionHandler,
  ComponentDef,
} from "melony";
```

## License

MIT © [Melony](https://github.com/ddaras/melony)

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [npm Package](https://www.npmjs.com/package/melony)

---

Built with ❤️ for developers building AI-powered interfaces