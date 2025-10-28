# Melony

**Define type-safe widgets. Let AI generate them for you.**

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- 🎯 **Widget-First** - Define custom widgets with `defineWidget()` and let AI generate them intelligently
- 🛡️ **Type Safe** - Full TypeScript support with Zod schema validation
- ⚡ **AI-Composed** - LLM automatically learns your widget schemas and generates them contextually  
- 🎨 **Built-in Components** - 20+ ready-to-use UI components (cards, forms, charts, etc.)
- 🔄 **Interactive** - Built-in action system for user interactions
- 🎯 **Smart Parsing** - Converts HTML-like tags to interactive components on the fly

## Installation

```bash
npm install melony
```

## Core Concept: `defineWidget()`

The heart of Melony is the `defineWidget()` function. Define your custom widgets once with type-safe schemas, and AI will generate them contextually in your apps.

### Basic Widget Definition

```typescript
import { defineWidget } from "melony/builder";
import { z } from "zod";

const weatherWidget = defineWidget({
  type: "weather-card",
  name: "Weather Card",
  description: "Displays current weather information for a city",
  
  // Zod schema for type safety
  schema: z.object({
    type: z.literal("weather-card"),
    city: z.string().describe("City name"),
    temperature: z.number().describe("Temperature in Fahrenheit"),
    condition: z.string().describe("Weather condition"),
    humidity: z.number().optional().describe("Humidity percentage"),
  }),
  
  // Simple template string with handlebars-style syntax
  template: `
    <card title="Weather in {{city}}">
      <row gap="md" align="center">
        <text value="{{temperature}}°F" size="xl" weight="bold" />
        <badge label="{{condition}}" variant="primary" />
      </row>
      {{#humidity}}
        <text value="Humidity: {{humidity}}%" color="muted" />
      {{/humidity}}
    </card>
  `.trim(),
  
  // Example data for AI training
  examples: [
    {
      city: "San Francisco",
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65
    }
  ]
});
```

### What `defineWidget()` Does

1. **Type Safety**: Validates all props with Zod schemas
2. **Template Rendering**: Uses your template string with Handlebars-style syntax for dynamic rendering
3. **AI Training**: Generates prompts that teach AI when and how to use your widgets
4. **IntelliSense**: Full TypeScript autocompletion and type checking

### Template Syntax

The template strings use Handlebars-style syntax for dynamic content:

- **Variables**: `{{propertyName}}` - Renders property values
- **Conditionals**: `{{#condition}}...{{/condition}}` - Shows content if condition is truthy
- **Negative conditionals**: `{{#!condition}}...{{/!condition}}` - Shows content if condition is falsy
- **HTML-like components**: `<card title="{{title}}">` - Clean, readable markup
- **Type safety**: Full TypeScript support with schema validation

### Widget in Action

Once defined, AI can generate your widget contextually:

```html
<!-- AI generates this based on user context -->
<widget 
  type="weather-card" 
  city="New York" 
  temperature="68" 
  condition="Sunny" 
  humidity="45" 
/>
```

## Quick Start

### 1. Define your custom widgets

```typescript
// widgets/weather-widget.ts
import { defineWidget } from "melony/builder";
import { z } from "zod";

export const weatherWidget = defineWidget({
  type: "weather-card",
  name: "Weather Card",
  description: "Shows weather info for a city",
  schema: z.object({
    type: z.literal("weather-card"),
    city: z.string(),
    temperature: z.number(),
    condition: z.string(),
  }),
  template: `
    <card title="Weather in {{city}}">
      <row gap="md">
        <text value="{{temperature}}°F" size="xl" />
        <badge label="{{condition}}" />
      </row>
    </card>
  `.trim()
});
```

### 2. Register widgets with AI system prompt

```tsx
import { MELONY_UI_GUIDE, generateWidgetSystemPrompt } from "melony/server";
import { weatherWidget } from "./widgets/weather-widget";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const customWidgets = [weatherWidget];

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: [
      MELONY_UI_GUIDE, // Built-in components
      generateWidgetSystemPrompt(customWidgets) // Your custom widgets
    ].join("\n\n"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 3. Render with custom widgets

```tsx
"use client";
import { useChat } from "ai/react";
import { MelonyProvider, MelonyMarkdown } from "melony";
import { weatherWidget } from "./widgets/weather-widget";

const customWidgets = [weatherWidget];

export default function Chat() {
  const { messages } = useChat({ api: "/api/chat" });

  return (
    <MelonyProvider 
      widgets={customWidgets} 
      onAction={handleAction}
    >
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

### 4. AI generates your custom widgets automatically

When a user asks "What's the weather in Seattle?", the AI automatically generates your custom widget:

```html
<!-- AI chooses the right widget based on context -->
<widget 
  type="weather-card" 
  city="Seattle" 
  temperature="65" 
  condition="Rainy" 
/>

<!-- Plus built-in components for additional content -->
<card title="Weather Tips">
  <text value="Don't forget your umbrella!" />
  <button 
    label="Get 7-Day Forecast" 
    onClickAction='{"type": "fetch-forecast", "payload": {"city": "Seattle"}}'
  />
</card>
```

## Advanced Widget Patterns

### Interactive Widgets with Actions

```typescript
import { defineWidget } from "melony/builder";

const userProfileWidget = defineWidget({
  type: "user-profile",
  description: "Interactive user profile card with actions",
  schema: z.object({
    type: z.literal("user-profile"),
    userId: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
    role: z.enum(["admin", "user", "moderator"]),
  }),
  template: `
    <card title="User Profile">
      <row gap="md" align="center">
        {{#avatar}}
          <image src="{{avatar}}" alt="Avatar" size="md" />
        {{/avatar}}
        <col gap="sm">
          <text value="{{name}}" size="lg" weight="bold" />
          <text value="{{email}}" color="muted" />
          <badge label="{{role}}" variant="secondary" />
        </col>
      </row>
      <row gap="sm">
        <button 
          label="Edit Profile" 
          variant="primary"
          onClickAction='{"type": "edit-user", "payload": {"userId": "{{userId}}"}}' />
        <button 
          label="Send Message" 
          variant="secondary"
          onClickAction='{"type": "send-message", "payload": {"userId": "{{userId}}", "name": "{{name}}"}}' />
      </row>
    </card>
  `.trim()
});
```

### Data-Driven Widgets

```typescript
import { defineWidget } from "melony/builder";

const taskListWidget = defineWidget({
  type: "task-list",
  description: "Displays a list of tasks with completion status",
  schema: z.object({
    type: z.literal("task-list"),
    title: z.string(),
    tasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      priority: z.enum(["low", "medium", "high"]).optional()
    }))
  }),
  template: `
    <card title="{{title}}">
      {{#tasks}}
        <row gap="sm" align="center">
          <checkbox 
            checked="{{completed}}" 
            onChangeAction='{"type": "toggle-task", "payload": {"taskId": "{{id}}"}}' />
          <text value="{{title}}" />
          {{#priority}}
            <badge label="{{priority}}" variant="secondary" />
          {{/priority}}
        </row>
      {{/tasks}}
    </card>
  `.trim()
});
```

## Component Syntax

Melony uses HTML-like syntax for both built-in components and custom widgets:

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

## Best Practices

### Widget Naming & Organization

```typescript
// ✅ Good: Descriptive type names
const weatherWidget = defineWidget({
  type: "weather-card",  // kebab-case, descriptive
  name: "Weather Card",  // Human-readable name
  // ...
});

// ✅ Good: Organize widgets by domain
// widgets/weather/
//   ├── weather-card.ts
//   ├── forecast-list.ts
//   └── index.ts

// widgets/user/
//   ├── user-profile.ts
//   ├── user-list.ts
//   └── index.ts
```

### Schema Design

```typescript
// ✅ Good: Detailed descriptions for AI
const schema = z.object({
  type: z.literal("weather-card"),
  city: z.string().describe("City name for weather lookup"),
  temperature: z.number().describe("Temperature in Fahrenheit"), 
  unit: z.enum(["F", "C"]).default("F").describe("Temperature unit"),
  showDetails: z.boolean().optional().describe("Show detailed weather info")
});

// ✅ Good: Use examples for AI training
const examples = [
  { city: "New York", temperature: 72, unit: "F", showDetails: true },
  { city: "London", temperature: 18, unit: "C", showDetails: false }
];
```

### Builder Functions

```typescript
// ✅ Good: Clean function syntax with conditional rendering
builder: (props) => {
  return card({ title: `Weather in ${props.city}` }, [
    // Always include core content
    text({ value: `${props.temperature}°${props.unit}` }),
    
    // Conditional content with ifBlock
    ifBlock({ condition: "!!showDetails" }, [
      text({ value: "Detailed forecast available" })
    ]),
    
    // Or use conditional JavaScript for complex logic
    ...(props.showDetails && props.forecast ? [
      row({ gap: "sm" }, [
        text({ value: "Tomorrow:", weight: "bold" }),
        text({ value: props.forecast.tomorrow })
      ])
    ] : [])
  ]);
}
```

## TypeScript Support

Full type safety for widget definitions and runtime:

```tsx
import type {
  WidgetDefinition,
  CompiledWidget,
  MelonyTheme,
  Action,
  ActionHandler,
  ComponentDef,
} from "melony";
import { defineWidget, card, text } from "melony/builder";

// Type-safe widget definition
const widget: WidgetDefinition<z.ZodObject<{
  type: z.ZodLiteral<"my-widget">;
  title: z.ZodString;
}>> = defineWidget({
  type: "my-widget",
  schema: z.object({
    type: z.literal("my-widget"),
    title: z.string(),
  }),
  builder: (props) => {
    // TypeScript knows props.title is string with full IntelliSense
    return card({ title: props.title }, [
      text({ value: "Widget content" })
    ]);
  }
});
```

## License

MIT © [Melony](https://github.com/ddaras/melony)

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [npm Package](https://www.npmjs.com/package/melony)

---

Built with ❤️ for developers building AI-powered interfaces