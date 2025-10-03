# Melony 🍈

A React library for building AI-powered conversational interfaces with intelligent component rendering and type-safe schema definitions.

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎯 **Smart Component Rendering** - Automatically parses and renders JSON structures embedded in AI responses
- 📝 **Markdown Support** - Built-in markdown rendering with GitHub Flavored Markdown support
- 🔧 **Custom Components** - Easily extend with your own component types
- 🛡️ **Type Safety** - Zod schema integration for type-safe component definitions
- 🤖 **AI-Ready Prompts** - Pre-built prompt templates to guide AI responses
- ⚡ **Partial JSON Parsing** - Handles streaming responses with incomplete JSON
- 🎨 **Flexible Styling** - BYO CSS with className support

## Installation

```bash
npm install melony
```

```bash
yarn add melony
```

```bash
pnpm add melony
```

## Quick Start

### Basic Usage

```tsx
import { MelonyCard } from 'melony';

function ChatMessage({ text }) {
  return <MelonyCard text={text} className="my-message" />;
}
```

The `MelonyCard` component will automatically:
- Render plain text as markdown
- Detect and parse JSON structures
- Render custom components when JSON is detected

### With Custom Components

```tsx
import { MelonyCard } from 'melony';

// Define your custom component
function ProductCard({ type, name, price, inStock }) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>${price}</p>
      <span>{inStock ? '✅ In Stock' : '❌ Out of Stock'}</span>
    </div>
  );
}

// Use it with MelonyCard
function App() {
  const aiResponse = `
    Here's the product you requested:
    {"type": "product-card", "name": "Laptop", "price": 999, "inStock": true}
  `;
  
  return (
    <MelonyCard 
      text={aiResponse}
      components={{
        "product-card": ProductCard
      }}
    />
  );
}
```

## Using AI Prompts

Melony provides pre-built prompts to guide AI models in generating structured responses.

```tsx
import { ALL_COMPONENTS_PROMPT } from 'melony/prompts';
import { useChat } from 'ai/react';

function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    systemMessage: ALL_COMPONENTS_PROMPT, // Inject the prompt
  });

  return (
    <div>
      {messages.map(m => (
        <MelonyCard key={m.id} text={m.content} />
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### Available Prompt Templates

```tsx
import {
  OVERVIEW_PROMPT,
  DETAILS_PROMPT,
  CHART_PROMPT,
  FORM_PROMPT,
  LIST_PROMPT,
  CARD_PROMPT,
  ALL_COMPONENTS_PROMPT,
  COMPACT_COMPONENTS_PROMPT,
  getComponentPrompt,
  getComponentPrompts,
  generateCustomPrompt,
} from 'melony/prompts';

// Use individual prompts
const systemPrompt = getComponentPrompt('overview');

// Combine multiple prompts
const systemPrompt = getComponentPrompts(['overview', 'chart', 'list']);

// Generate custom prompt based on config
const systemPrompt = generateCustomPrompt({
  overview: true,
  chart: true,
  form: false,
});
```

## Type-Safe Components with Zod

Create type-safe custom components using Zod schemas:

```tsx
import { z } from 'zod';
import { zodSchemaToPrompt, defineComponentSchema } from 'melony/zod';
import { MelonyCard } from 'melony';

// Define your schema
const ProductSchema = z.object({
  name: z.string().describe('Product name'),
  price: z.number().describe('Product price in USD'),
  inStock: z.boolean().describe('Whether the product is in stock'),
  tags: z.array(z.string()).optional().describe('Product tags'),
});

// Generate AI prompt from schema
const productPrompt = zodSchemaToPrompt({
  type: 'product-card',
  schema: ProductSchema,
  description: 'Product information display',
  examples: [{
    type: 'product-card',
    name: 'Laptop',
    price: 999,
    inStock: true,
    tags: ['electronics', 'computers']
  }],
});

// Type-safe component definition
const ProductComponent = defineComponentSchema({
  type: 'product-card',
  schema: ProductSchema,
  description: 'Display product information',
});

// Your React component (fully typed)
function ProductCard(props: z.infer<typeof ProductSchema> & { type: string }) {
  // Validate props at runtime
  const validated = ProductComponent.validate(props);
  
  return (
    <div>
      <h3>{validated.name}</h3>
      <p>${validated.price}</p>
      {validated.tags?.map(tag => <span key={tag}>{tag}</span>)}
    </div>
  );
}

// Use in your app
function App() {
  return (
    <MelonyCard
      text={aiResponse}
      components={{ 'product-card': ProductCard }}
    />
  );
}
```

### Multiple Schemas

```tsx
import { zodSchemasToPrompt, combinePrompts } from 'melony/zod';
import { ALL_COMPONENTS_PROMPT } from 'melony/prompts';

const customPrompt = zodSchemasToPrompt([
  {
    type: 'product-card',
    schema: ProductSchema,
    description: 'Product information',
  },
  {
    type: 'user-profile',
    schema: UserSchema,
    description: 'User profile display',
  },
]);

// Combine with built-in prompts
const finalPrompt = combinePrompts(ALL_COMPONENTS_PROMPT, [
  { type: 'product-card', schema: ProductSchema },
  { type: 'user-profile', schema: UserSchema },
]);
```

## API Reference

### `MelonyCard`

Main component for rendering AI responses.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | The text content to render (can contain JSON) |
| `className` | `string?` | Optional CSS class name |
| `components` | `Record<string, React.FC<any>>?` | Map of component types to React components |

### Exports

```tsx
// Main component
import { MelonyCard } from 'melony';

// Prompt utilities
import {
  ALL_COMPONENTS_PROMPT,
  COMPACT_COMPONENTS_PROMPT,
  OVERVIEW_PROMPT,
  DETAILS_PROMPT,
  CHART_PROMPT,
  FORM_PROMPT,
  LIST_PROMPT,
  CARD_PROMPT,
  CUSTOM_COMPONENT_PROMPT,
  getComponentPrompt,
  getComponentPrompts,
  generateCustomPrompt,
} from 'melony/prompts';

// Zod utilities
import {
  zodSchemaToPrompt,
  zodSchemasToPrompt,
  defineComponentSchema,
  combinePrompts,
} from 'melony/zod';
```

## How It Works

1. **Text Input**: `MelonyCard` receives a text string from an AI response
2. **JSON Detection**: Automatically detects JSON structures using regex pattern matching
3. **Partial Parsing**: Uses `partial-json` to handle streaming/incomplete JSON
4. **Component Matching**: Matches `type` field in JSON to custom components
5. **Rendering**: Renders custom component if found, otherwise renders as markdown

### Example Flow

```
Input: "Here's the data: {\"type\": \"chart\", \"data\": [...]}"
  ↓
Parse: Detect JSON structure
  ↓
Match: Find "chart" in components map
  ↓
Render: <ChartComponent data={...} />
```

If no JSON is found or no component matches:
```
Input: "This is a normal message"
  ↓
Render: <ReactMarkdown>This is a normal message</ReactMarkdown>
```

## Built-in Component Types

When using the prompt utilities, you can guide AI to generate these component types:

- **overview** - Key-value summaries and status reports
- **details** - Multi-section detailed content
- **chart** - Data visualization (bar, line, pie)
- **form** - User input collection forms
- **list** - Bullet point lists
- **card** - Highlighted content blocks

Note: These are prompt templates only. You need to implement the actual React components.

## Requirements

- React >= 18.0.0
- React DOM >= 18.0.0

## Dependencies

- `@ai-sdk/openai` - AI SDK OpenAI provider
- `ai` - Vercel AI SDK
- `zod` - TypeScript-first schema validation
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `partial-json` - Partial JSON parsing
- `use-stick-to-bottom` - Scroll management utility

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/ddaras/melony](https://github.com/ddaras/melony)

## Issues

[https://github.com/ddaras/melony/issues](https://github.com/ddaras/melony/issues)

