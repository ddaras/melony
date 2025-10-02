# Import Paths for Zod Schema Utilities

The Zod schema utilities are available through multiple import paths depending on your use case.

## Import Options

### 1. From Main Package (Client & Server)

Import from the main package when you need both React components and Zod utilities:

```tsx
import { 
  zodSchemaToPrompt, 
  zodSchemasToPrompt,
  defineComponentSchema,
  combinePrompts,
  MelonyCard,
  MelonyProvider 
} from "melony";
```

**Use when:**
- Building React components that use Zod schemas
- Need both UI and schema utilities in one place

### 2. From `/zod` Export (Server-Side Optimized)

Import just the Zod utilities without React dependencies:

```ts
import { 
  zodSchemaToPrompt, 
  zodSchemasToPrompt,
  defineComponentSchema,
  combinePrompts 
} from "melony/zod";
```

**Use when:**
- Server-side API routes (Next.js, Express, etc.)
- Generating prompts for OpenAI/Anthropic
- No React dependencies needed
- Optimized bundle size for backend

### 3. From `/prompts` Export (No Dependencies)

Import just the static prompt strings:

```ts
import { 
  ALL_COMPONENTS_PROMPT,
  OVERVIEW_PROMPT,
  getComponentPrompt 
} from "melony/prompts";
```

**Use when:**
- Simple prompt injection
- No schema validation needed
- Minimal bundle size

## Examples by Use Case

### Next.js App Router (Server Component)

```tsx
// app/api/chat/route.ts
import { zodSchemaToPrompt } from "melony/zod";
import { z } from "zod";

const productSchema = z.object({
  type: z.literal("product"),
  name: z.string(),
  price: z.number(),
});

const prompt = zodSchemaToPrompt({
  type: "product",
  schema: productSchema,
});

export async function POST(req: Request) {
  const systemPrompt = `You are a shopping assistant. ${prompt}`;
  // ... use with AI SDK
}
```

### React Component (Client)

```tsx
// app/components/Chat.tsx
"use client";

import { z } from "zod";
import { MelonyCard, zodSchemaToPrompt } from "melony";

const productSchema = z.object({
  type: z.literal("product"),
  name: z.string(),
  price: z.number(),
});

const ProductCard: React.FC<z.infer<typeof productSchema>> = (props) => {
  return <div>...</div>;
};

export function Chat() {
  return (
    <MelonyCard
      text={response}
      customComponents={{
        product: ProductCard
      }}
    />
  );
}
```

### Express.js Backend

```ts
// server.ts
import express from "express";
import { zodSchemaToPrompt } from "melony/zod";
import { z } from "zod";

const app = express();

const analyticsSchema = z.object({
  type: z.literal("analytics"),
  metrics: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
});

app.post("/api/chat", async (req, res) => {
  const prompt = zodSchemaToPrompt({
    type: "analytics",
    schema: analyticsSchema,
  });
  
  // Use with OpenAI, Anthropic, etc.
});
```

### Shared Schema Across Client and Server

```ts
// shared/schemas.ts
import { z } from "zod";
import { defineComponentSchema } from "melony/zod";

export const productSchema = defineComponentSchema({
  type: "product-card",
  schema: z.object({
    type: z.literal("product-card"),
    name: z.string(),
    price: z.number(),
    description: z.string(),
  }),
  description: "Product display cards",
});

// Server: app/api/chat/route.ts
import { zodSchemaToPrompt } from "melony/zod";
import { productSchema } from "@/shared/schemas";

const prompt = zodSchemaToPrompt(productSchema);

// Client: app/components/Product.tsx
import { productSchema } from "@/shared/schemas";

const ProductCard: React.FC<any> = (props) => {
  const data = productSchema.validate(props);
  return <div>{data.name}</div>;
};
```

## Bundle Size Comparison

| Import Path | Dependencies | Typical Size | Use Case |
|-------------|-------------|--------------|----------|
| `melony` | React + Zod | ~40KB | Full client app |
| `melony/zod` | Zod only | ~15KB | Server-side only |
| `melony/prompts` | None | ~3KB | Static prompts |

## TypeScript Support

All import paths have full TypeScript support with generated `.d.ts` files:

```ts
// All of these have full type inference
import { zodSchemaToPrompt } from "melony";
import { zodSchemaToPrompt } from "melony/zod";

// Type-safe validation
const config = defineComponentSchema({
  type: "product",
  schema: z.object({ /* ... */ }),
});

const validatedData = config.validate(unknownData); // Fully typed!
```

## CommonJS Support

All import paths support both ESM and CommonJS:

```js
// ESM
import { zodSchemaToPrompt } from "melony/zod";

// CommonJS
const { zodSchemaToPrompt } = require("melony/zod");
```

