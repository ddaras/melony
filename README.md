# Melony 🍈

A React library for building AI-powered conversational interfaces with intelligent component rendering and type-safe schema definitions.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Smart Component Rendering** - Automatically parses and renders JSON structures embedded in AI responses
- 🛡️ **Type Safety** - Zod schema integration for type-safe component definitions
- 🤖 **AI-Ready Prompts** - Generate prompts from Zod schemas automatically
- ⚡ **Partial JSON Parsing** - Handles streaming responses with incomplete JSON
- 📝 **Markdown Support** - Built-in markdown rendering with GFM support

## Installation

```bash
npm install melony
```

## Quick Start

```tsx
import { MelonyCard } from 'melony';

function ChatMessage({ text }) {
  return <MelonyCard text={text} />;
}
```

The component automatically detects JSON in AI responses and renders matching custom components.

## Complete Example: Weather Card

```tsx
import { zodSchemaToPrompt } from "melony/zod";
import { MelonyCard } from "melony";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Snowflake,
} from "lucide-react";

// 1. Define schema once
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

// 2. Generate AI prompt automatically
export const weatherCardUIComponentPrompt = zodSchemaToPrompt({
  type: "weather-card",
  schema: weatherSchema,
  description:
    "Use for displaying current weather information with temperature, conditions, and additional details",
  examples: [
    {
      type: "weather-card",
      location: "New York, NY",
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 8,
      description: "Light winds with occasional clouds",
      icon: "cloudy",
    },
    {
      type: "weather-card",
      location: "Los Angeles, CA",
      temperature: 85,
      condition: "Sunny",
      humidity: 40,
      windSpeed: 5,
      description: "Clear skies and warm temperatures",
      icon: "sunny",
    },
  ],
});

// 3. Use for type-safe components
type WeatherCardProps = z.infer<typeof weatherSchema>;

const getWeatherIcon = (icon?: string, condition?: string) => {
  if (icon === "sunny" || condition?.toLowerCase().includes("sun")) {
    return <Sun className="w-12 h-12 text-yellow-500" />;
  }
  if (icon === "rainy" || condition?.toLowerCase().includes("rain")) {
    return <CloudRain className="w-12 h-12 text-blue-500" />;
  }
  if (icon === "snowy" || condition?.toLowerCase().includes("snow")) {
    return <Snowflake className="w-12 h-12 text-blue-200" />;
  }
  return <Cloud className="w-12 h-12 text-gray-500" />;
};

export const WeatherCard: React.FC<WeatherCardProps> = (props) => {
  const {
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    description,
    icon,
  } = props;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{location}</h3>
            <p className="text-sm text-gray-600">{condition}</p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 bg-white/50 rounded-full">
            {getWeatherIcon(icon, condition)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Temperature */}
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="w-5 h-5 text-red-500" />
          <span className="text-3xl font-bold text-gray-900">
            {temperature}°F
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}

        {/* Additional Details */}
        <div className="flex flex-wrap gap-2">
          {humidity !== undefined && (
            <Badge variant="secondary" className="bg-white/70 text-gray-700">
              <Droplets className="w-3 h-3 mr-1" />
              {humidity}% humidity
            </Badge>
          )}
          {windSpeed !== undefined && (
            <Badge variant="secondary" className="bg-white/70 text-gray-700">
              <Wind className="w-3 h-3 mr-1" />
              {windSpeed} mph
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 4. Use in your chat interface
function ChatInterface() {
  const { messages } = useChat({
    api: '/api/chat',
    systemMessage: weatherCardUIComponentPrompt, // Inject the generated prompt
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

1. **Define Schema** - Create a Zod schema for your component's data structure
2. **Generate Prompt** - Use `zodSchemaToPrompt()` to automatically generate an AI prompt
3. **Type-Safe Component** - Use `z.infer` to create type-safe React components
4. **Render** - Pass your components to `MelonyCard` to automatically render them

The AI will respond with JSON like:
```json
{"type": "weather-card", "location": "Seattle", "temperature": 68, ...}
```

And `MelonyCard` automatically renders your `WeatherCard` component!

## API Reference

### `MelonyCard`

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Text content to render (can contain JSON) |
| `className` | `string?` | Optional CSS class name |
| `components` | `Record<string, React.FC<any>>?` | Map of component types to React components |

### `zodSchemaToPrompt(config)`

Generate an AI prompt from a Zod schema.

| Option | Type | Description |
|--------|------|-------------|
| `type` | `string` | Component type identifier |
| `schema` | `z.ZodType` | Zod schema for validation |
| `description` | `string?` | When to use this component |
| `examples` | `any[]?` | Example instances |
| `customInstructions` | `string?` | Additional AI instructions |

### Additional Utilities

```tsx
// Generate prompts for multiple schemas
import { zodSchemasToPrompt } from 'melony/zod';

const prompt = zodSchemasToPrompt([
  { type: 'weather-card', schema: weatherSchema },
  { type: 'user-profile', schema: userSchema },
]);

// Combine with built-in prompts
import { combinePrompts } from 'melony/zod';
import { ALL_COMPONENTS_PROMPT } from 'melony/prompts';

const finalPrompt = combinePrompts(ALL_COMPONENTS_PROMPT, [
  { type: 'weather-card', schema: weatherSchema },
]);

// Type-safe component definition
import { defineComponentSchema } from 'melony/zod';

const WeatherComponent = defineComponentSchema({
  type: 'weather-card',
  schema: weatherSchema,
  description: 'Display weather information',
});

// Includes validate function
const validated = WeatherComponent.validate(data);
```

## Built-in Prompts

Pre-built prompt templates for common UI patterns:

```tsx
import {
  ALL_COMPONENTS_PROMPT,
  OVERVIEW_PROMPT,
  DETAILS_PROMPT,
  CHART_PROMPT,
  FORM_PROMPT,
  LIST_PROMPT,
  CARD_PROMPT,
  getComponentPrompts,
  generateCustomPrompt,
} from 'melony/prompts';

// Use specific prompts
const prompt = getComponentPrompts(['overview', 'chart', 'list']);

// Generate based on config
const prompt = generateCustomPrompt({
  overview: true,
  chart: true,
  form: false,
});
```

## Exports

```tsx
// Main component
import { MelonyCard } from 'melony';

// Zod utilities
import {
  zodSchemaToPrompt,
  zodSchemasToPrompt,
  defineComponentSchema,
  combinePrompts,
} from 'melony/zod';

// Prompt utilities
import {
  ALL_COMPONENTS_PROMPT,
  COMPACT_COMPONENTS_PROMPT,
  // ... more prompts
  getComponentPrompt,
  getComponentPrompts,
  generateCustomPrompt,
} from 'melony/prompts';
```

## Requirements

- React >= 18.0.0
- React DOM >= 18.0.0

## License

MIT

## Links

- [GitHub Repository](https://github.com/ddaras/melony)
- [Report Issues](https://github.com/ddaras/melony/issues)
