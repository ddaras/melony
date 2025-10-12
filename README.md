# Melony

Generate React UIs from AI responses in real-time.  
No tool calling latency. No completion waiting. Just smooth, progressive rendering as the AI thinks.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Demo](https://raw.githubusercontent.com/ddaras/melony/main/screen-chart.gif)

## Why Melony?

- ⚡ **Zero Latency** - Components render progressively during streaming
- 🎯 **Smart Parsing** - Identifies component JSON with `@melony:` prefix
- 🛡️ **Type Safe** - Full Zod schema integration
- 📝 **Markdown Support** - Built-in GFM rendering
- 🪶 **Lightweight** - Minimal dependencies

## Installation

```bash
pnpm add melony zod
```

## Quick Start

```tsx
import { MelonyCard } from "melony";

<MelonyCard
  text={streamingAIResponse}
  components={{
    "weather-card": WeatherCard,
  }}
/>;
```

As the AI streams `@melony:{"type": "weather-card", "temperature": 72, "location": "NYC", "condition": "Sunny"}`, your component renders immediately with the complete data.

## Complete Example

### 1. Define Schema & Generate Prompt

```tsx
import { z } from "zod";
import { zodSchemaToPrompt } from "melony/zod";

const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
});

const weatherUIPrompt = zodSchemaToPrompt({
  type: "weather-card",
  schema: weatherSchema,
  description: "Display current weather information",
  examples: [
    {
      type: "weather-card",
      location: "New York, NY",
      temperature: 72,
      condition: "Partly Cloudy",
    },
  ],
});
```

### 2. Create Component

```tsx
type WeatherCardProps = z.infer<typeof weatherSchema>;

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperature,
  condition,
}) => (
  <Card>
    <h3>{location}</h3>
    <p>
      {temperature}°F - {condition}
    </p>
  </Card>
);
```

### 3. Server-Side Prompt Injection

```tsx
// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { weatherUIPrompt } from "@components/weather";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: `You are a helpful assistant. ${weatherUIPrompt}
    
    IMPORTANT: When rendering UI components, prefix the JSON with @melony:
    Example: @melony:{"type": "weather-card", "location": "NYC", "temperature": 72, "condition": "Sunny"}
    
    Regular JSON without the prefix will be displayed as text.`,
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 4. Client-Side Rendering

```tsx
import { useChat } from "ai/react";

function Chat() {
  const { messages } = useChat({
    api: "/api/chat",
  });

  return messages.map((message) =>
    message.parts.map((part) =>
      part.type === "text" ? (
        <MelonyCard
          key={part.id}
          text={part.content}
          components={{ "weather-card": WeatherCard }}
        />
      ) : null
    )
  );
}
```

## API

### `MelonyCard`

| Prop         | Type                       | Description                              |
| ------------ | -------------------------- | ---------------------------------------- |
| `text`       | `string`                   | AI response (can contain streaming JSON) |
| `components` | `Record<string, React.FC>` | Map of type identifiers to components    |

### `zodSchemaToPrompt(config)`

Generate AI prompts from Zod schemas.

| Option               | Type        | Required | Description                |
| -------------------- | ----------- | -------- | -------------------------- |
| `type`               | `string`    | ✅       | Component type identifier  |
| `schema`             | `z.ZodType` | ✅       | Zod schema for validation  |
| `description`        | `string`    | ❌       | When to use this component |
| `examples`           | `any[]`     | ❌       | Example JSON objects       |
| `customInstructions` | `string`    | ❌       | Additional instructions    |

### `zodSchemasToPrompt(configs)`

Generate prompts for multiple component types.

```tsx
const prompt = zodSchemasToPrompt([
  { type: "weather-card", schema: weatherSchema },
  { type: "chart", schema: chartSchema },
]);
```

### `defineComponentSchema(config)`

Create type-safe component definitions with validation.

```tsx
const WeatherComponent = defineComponentSchema({
  type: "weather-card",
  schema: weatherSchema,
});

const validData = WeatherComponent.validate(data);
```

## Multiple Components

```tsx
<MelonyCard
  text={message}
  components={{
    "weather-card": WeatherCard,
    "user-profile": UserProfile,
    chart: Chart,
  }}
/>
```

## How It Works

1. AI streams response containing text and `@melony:` prefixed JSON
2. `MelonyCard` identifies and parses complete JSON components
3. Components render when complete JSON is detected
4. Text without the prefix renders as markdown
5. Regular JSON without the prefix displays as plain text

### The `@melony:` Prefix

The `@melony:` prefix is used to distinguish JSON that should be rendered as UI components from regular JSON that might appear in text.

```tsx
// This will render as a component
"The weather is nice today! @melony:{\"type\": \"weather-card\", \"temperature\": 72}"

// This will display as text
"Here's some data: {\"foo\": \"bar\"}"
```

No waiting. No tool calls. Just instant UI generation.

## License

MIT
