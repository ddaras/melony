# Melony 🍈

A lightweight React library for building AI-powered conversational interfaces with intelligent JSON component rendering and type-safe schema definitions.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Smart Component Rendering** - Automatically parses and renders JSON structures embedded in AI responses
- 🛡️ **Type Safety** - Full Zod schema integration for type-safe component definitions
- 🤖 **AI Prompt Generation** - Auto-generate AI prompts from Zod schemas
- ⚡ **Partial JSON Parsing** - Handles streaming AI responses with incomplete JSON
- 📝 **Markdown Support** - Built-in markdown rendering with GitHub Flavored Markdown (GFM)
- 🪶 **Lightweight** - Minimal dependencies, maximum flexibility

## Installation

```bash
npm install melony zod
```

## Quick Start

```tsx
import { MelonyCard } from 'melony';

function ChatMessage({ text }) {
  return (
    <MelonyCard 
      text={text}
      components={{
        "weather-card": WeatherCard
      }}
    />
  );
}
```

The `MelonyCard` component automatically:
- Detects JSON objects with a `type` field in AI responses
- Renders matching custom React components
- Renders remaining text as markdown

## Complete Example: Weather Card

### 1. Define Your Schema

```tsx
import { z } from "zod";

const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string(),
  temperature: z.number(),
  condition: z.string(),
  humidity: z.number().min(0).max(100).optional(),
  windSpeed: z.number().optional(),
  description: z.string().optional(),
  icon: z.enum(["sunny", "cloudy", "rainy", "snowy"]).optional(),
});

type WeatherCardProps = z.infer<typeof weatherSchema>;
```

### 2. Generate AI Prompt

```tsx
import { zodSchemaToPrompt } from "melony/zod";

export const weatherPrompt = zodSchemaToPrompt({
  type: "weather-card",
  schema: weatherSchema,
  description: "Display current weather information with temperature, conditions, and additional details",
  examples: [
    {
      type: "weather-card",
      location: "New York, NY",
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 8,
      icon: "cloudy",
    },
  ],
});
```

### 3. Create Your Component

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";

export const WeatherCard: React.FC<WeatherCardProps> = ({
  location,
  temperature,
  condition,
  humidity,
  windSpeed,
  description,
  icon,
}) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{location}</h3>
            <p className="text-sm text-gray-600">{condition}</p>
          </div>
          <div className="text-3xl">{temperature}°F</div>
        </div>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm mb-2">{description}</p>}
        {humidity && <p className="text-xs">Humidity: {humidity}%</p>}
        {windSpeed && <p className="text-xs">Wind: {windSpeed} mph</p>}
      </CardContent>
    </Card>
  );
};
```

### 4. Use in Your Chat Interface

```tsx
import { useChat } from 'ai/react';

function ChatInterface() {
  const { messages } = useChat({
    api: '/api/chat',
    systemMessage: weatherPrompt, // Inject generated prompt
  });

  return (
    <div>
      {messages.map(m => (
        <MelonyCard 
          key={m.id} 
          text={m.content}
          components={{
            "weather-card": WeatherCard
          }}
        />
      ))}
    </div>
  );
}
```

## How It Works

1. **Schema → Prompt**: `zodSchemaToPrompt()` converts your Zod schema into a detailed AI prompt with JSON schema and examples
2. **AI Response**: The AI responds with text containing JSON: `"The weather looks nice! {"type": "weather-card", "location": "Seattle", ...}"`
3. **Smart Parsing**: `MelonyCard` parses the response, extracting JSON objects
4. **Component Rendering**: JSON objects with matching `type` fields render as custom components
5. **Markdown Fallback**: Remaining text renders as markdown

## API Reference

### `MelonyCard`

Main rendering component for AI responses with embedded JSON.

```tsx
<MelonyCard 
  text={aiResponse}
  components={{
    "component-type": YourComponent,
  }}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Text content to render (can contain JSON objects) |
| `components` | `Record<string, React.FC<any>>` | Map of component type identifiers to React components |

### `zodSchemaToPrompt(config)`

Generate an AI prompt from a Zod schema.

```tsx
import { zodSchemaToPrompt } from 'melony/zod';

const prompt = zodSchemaToPrompt({
  type: 'weather-card',
  schema: weatherSchema,
  description: 'When to use this component',
  examples: [{ type: 'weather-card', /* ... */ }],
  customInstructions: 'Additional AI instructions',
});
```

**Config Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `type` | `string` | ✅ | Component type identifier |
| `schema` | `z.ZodType` | ✅ | Zod schema for validation |
| `description` | `string` | ❌ | When to use this component |
| `examples` | `any[]` | ❌ | Example JSON objects |
| `customInstructions` | `string` | ❌ | Additional AI instructions |
| `includeFieldDescriptions` | `boolean` | ❌ | Include field details (default: true) |

### `zodSchemasToPrompt(configs)`

Generate prompts for multiple schemas at once.

```tsx
import { zodSchemasToPrompt } from 'melony/zod';

const prompt = zodSchemasToPrompt([
  { type: 'weather-card', schema: weatherSchema, description: '...' },
  { type: 'user-profile', schema: userSchema, description: '...' },
  { type: 'product-card', schema: productSchema, description: '...' },
]);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `configs` | `ZodSchemaPromptConfig[]` | Array of schema configurations |

**Returns:** Combined prompt string for all schemas.

### `defineComponentSchema(config)`

Create a type-safe component definition with built-in validation.

```tsx
import { defineComponentSchema } from 'melony/zod';

const WeatherComponent = defineComponentSchema({
  type: 'weather-card',
  schema: weatherSchema,
  description: 'Display weather information',
});

// Type-safe validation
try {
  const validData = WeatherComponent.validate(unknownData);
  // validData is fully typed
} catch (error) {
  // Handle validation error
}
```

**Returns:** Schema configuration with added `validate()` method.

## Advanced Usage

### Multiple Component Types

```tsx
import { zodSchemasToPrompt } from 'melony/zod';

const systemPrompt = zodSchemasToPrompt([
  { 
    type: 'weather-card', 
    schema: weatherSchema,
    description: 'Display weather data'
  },
  { 
    type: 'user-profile', 
    schema: userSchema,
    description: 'Show user information'
  },
  { 
    type: 'chart', 
    schema: chartSchema,
    description: 'Visualize data trends'
  },
]);

// Use in chat
<MelonyCard 
  text={message}
  components={{
    "weather-card": WeatherCard,
    "user-profile": UserProfile,
    "chart": Chart,
  }}
/>
```

### Streaming Support

`MelonyCard` uses `partial-json` to parse incomplete JSON during streaming:

```tsx
// AI is streaming: "Here's the weather: {"type": "weather-card", "loc"
// MelonyCard will attempt to parse and render as more data arrives
```

### Custom Prompts

```tsx
import { getComponentPrompt } from 'melony/prompts';

const customPrompt = getComponentPrompt('custom');
// Returns generic instructions for custom components
```

### Type-Safe Component Props

```tsx
import { z } from 'zod';

const productSchema = z.object({
  type: z.literal('product-card'),
  name: z.string(),
  price: z.number(),
  image: z.string().url(),
  inStock: z.boolean(),
});

// Automatically infer prop types
type ProductCardProps = z.infer<typeof productSchema>;

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  // props are fully typed
  return <div>{props.name} - ${props.price}</div>;
};
```

## Package Exports

```tsx
// Main component
import { MelonyCard } from 'melony';

// Zod utilities
import { 
  zodSchemaToPrompt, 
  zodSchemasToPrompt, 
  defineComponentSchema 
} from 'melony/zod';

// Prompt utilities
import { 
  getComponentPrompt,
  getComponentPrompts,
  generateCustomPrompt,
  CUSTOM_COMPONENT_PROMPT,
} from 'melony/prompts';
```

## Requirements

- React >= 18.0.0
- Zod >= 4.0.0

## How JSON Detection Works

`MelonyCard` parses text and detects JSON objects with the following criteria:

1. Valid JSON object (or partial JSON during streaming)
2. Contains a `type` field
3. Has a matching component in the `components` prop

Everything else is rendered as markdown with GFM support (tables, strikethrough, task lists, etc.).

## Use Cases

- **AI Chat Interfaces** - Render rich components in AI responses
- **Dynamic Dashboards** - Let AI create visualizations on the fly
- **Form Generation** - AI generates form components based on context
- **Data Visualization** - Embed charts and graphs in AI responses
- **Multi-Modal Responses** - Mix text explanations with interactive components

## License

MIT

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [Report Issues](https://github.com/ddaras/melony/issues)
- [NPM Package](https://www.npmjs.com/package/melony)
