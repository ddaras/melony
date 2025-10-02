# Zod Schema Support - Feature Summary

## Overview

Added support for defining custom component schemas using Zod and automatically generating AI prompts with JSON schema. This allows users to define their schemas once and use them for both runtime validation and AI prompt generation.

## What Was Added

### 1. New Utility Module: `zod-schema-utils.ts`

**Location:** `src/zod-schema-utils.ts`

**Exports:**
- `zodSchemaToPrompt(config)` - Convert a single Zod schema to AI prompt
- `zodSchemasToPrompt(configs)` - Convert multiple Zod schemas to combined prompt
- `defineComponentSchema(config)` - Type-safe schema definition with validation helper
- `combinePrompts(builtInPrompt, zodConfigs)` - Merge built-in and custom prompts
- `ZodSchemaPromptConfig` interface

### 2. Build Configuration

**Updated files:**
- `tsup.config.ts` - Added separate build entry for zod-schema-utils
- `package.json` - Added new export path `melony/zod`

**New exports:**
```json
{
  "exports": {
    ".": "./dist/index.js",
    "./prompts": "./dist/melony-card-prompts.js",
    "./zod": "./dist/zod-schema-utils.js"  // NEW
  }
}
```

### 3. Documentation

**New documentation files:**
- `src/zod-schema-example.md` - Comprehensive examples and use cases
- `src/zod-schema-imports.md` - Import path guide and optimization tips
- Updated `README.md` - Added Zod Schema Support section

### 4. Type Safety

Full TypeScript support with:
- Generated `.d.ts` and `.d.cts` type definition files
- Type inference for schemas using `z.infer<>`
- Type-safe validation with `defineComponentSchema`

## Key Features

### 1. Single Source of Truth
Define your schema once with Zod:
```tsx
const productSchema = z.object({
  type: z.literal("product-card"),
  name: z.string(),
  price: z.number(),
});
```

### 2. Auto-Generated Prompts
Automatically generate AI prompts with JSON schema:
```tsx
const prompt = zodSchemaToPrompt({
  type: "product-card",
  schema: productSchema,
  description: "Use for product displays",
  examples: [{ /* ... */ }],
});
```

### 3. Runtime Validation
Validate AI-generated data before rendering:
```tsx
const config = defineComponentSchema({
  type: "product-card",
  schema: productSchema,
});

const validatedData = config.validate(unknownData);
```

### 4. Multiple Import Paths

**Full package (client):**
```tsx
import { zodSchemaToPrompt, MelonyCard } from "melony";
```

**Server-side optimized (no React):**
```tsx
import { zodSchemaToPrompt } from "melony/zod";
```

**Static prompts only:**
```tsx
import { ALL_COMPONENTS_PROMPT } from "melony/prompts";
```

## Use Cases

### 1. Next.js App Router
```tsx
// Server Component - API Route
import { zodSchemaToPrompt } from "melony/zod";

// Client Component - UI
import { MelonyCard } from "melony";
```

### 2. E-commerce Applications
Define product, cart, and checkout schemas with automatic prompt generation

### 3. Analytics Dashboards
Create chart and metric schemas that work with both AI and React components

### 4. Form Builders
Define form schemas once, use for validation and AI understanding

### 5. Custom Business Components
Any domain-specific component that needs structured data

## Benefits

1. **DRY Principle** - Define schema once, use everywhere
2. **Type Safety** - Full TypeScript support throughout
3. **Validation** - Runtime validation with Zod
4. **Sync** - Schema and prompts always match
5. **Optimization** - Separate imports for server/client optimization
6. **Standards** - Uses JSON Schema standard for AI understanding

## Technical Implementation

### JSON Schema Conversion
Uses Zod v4's native `z.toJSONSchema()` method to convert schemas to JSON Schema format.

### Prompt Generation
Generates prompts that include:
- Example JSON structure
- JSON Schema definition
- Usage descriptions
- Multiple examples (if provided)
- Custom instructions

### Type Safety
Leverages TypeScript generics to maintain type inference from Zod schema to React components.

## Files Changed/Added

**New files:**
- `src/zod-schema-utils.ts` (160 lines)
- `src/zod-schema-example.md` (370 lines)
- `src/zod-schema-imports.md` (260 lines)

**Modified files:**
- `src/index.ts` - Added export
- `package.json` - Added export path
- `tsup.config.ts` - Added build entry
- `README.md` - Added documentation section

**Generated files:**
- `dist/zod-schema-utils.js` (ESM)
- `dist/zod-schema-utils.cjs` (CommonJS)
- `dist/zod-schema-utils.d.ts` (TypeScript types)
- `dist/zod-schema-utils.d.cts` (CommonJS types)
- Corresponding `.map` files

## Build Output

```
ESM dist/zod-schema-utils.js     3.44 KB
CJS dist/zod-schema-utils.cjs    3.56 KB
DTS dist/zod-schema-utils.d.ts   1.54 KB
```

## Example Output

When calling `zodSchemaToPrompt()`, generates:

```
To display a product-card, use this JSON format:
{
  "type": "product-card",
  "name": "Wireless Headphones",
  "price": 99.99,
  "description": "Premium headphones"
}

JSON Schema:
{
  "type": "object",
  "properties": {
    "type": { "type": "string", "const": "product-card" },
    "name": { "type": "string" },
    "price": { "type": "number" },
    "description": { "type": "string" }
  },
  "required": ["type", "name", "price", "description"]
}

Use the product-card component for:
Use for product displays and e-commerce
```

## Backward Compatibility

✅ Fully backward compatible
- No breaking changes to existing APIs
- New utilities are additive only
- Existing code continues to work unchanged
- Optional feature - users can adopt gradually

## Dependencies

- Zod v4.1.11 (already in package.json)
- No new dependencies added

## Future Enhancements

Potential improvements:
1. Support for more complex Zod validators (refine, transform)
2. AI model-specific prompt formatting (OpenAI vs Anthropic)
3. Visual schema builder UI
4. Schema versioning and migration tools
5. Automatic component generation from schemas

## Testing Recommendations

Users should test:
1. Schema definition and validation
2. Prompt generation with various schema types
3. Integration with AI models (OpenAI, Anthropic, etc.)
4. React component rendering with validated data
5. Server-side vs client-side imports
6. TypeScript type inference

## Documentation Links

- Main README: `README.md` (Zod Schema Support section)
- Detailed examples: `src/zod-schema-example.md`
- Import guide: `src/zod-schema-imports.md`
- Basic example: `src/melony-card-example.md` (existing)

## API Reference

### `zodSchemaToPrompt(config)`

**Parameters:**
- `type: string` - Component type identifier
- `schema: z.ZodType` - Zod schema definition
- `description?: string` - Usage description
- `examples?: any[]` - Example objects
- `customInstructions?: string` - Additional AI instructions

**Returns:** `string` - Formatted prompt text

### `zodSchemasToPrompt(configs)`

**Parameters:**
- `configs: ZodSchemaPromptConfig[]` - Array of schema configs

**Returns:** `string` - Combined prompt text

### `defineComponentSchema<T>(config)`

**Parameters:** Same as `zodSchemaToPrompt`

**Returns:** Config with added `validate` method

### `combinePrompts(builtIn, zodConfigs)`

**Parameters:**
- `builtInPrompt: string` - Existing prompt text
- `zodConfigs: ZodSchemaPromptConfig[]` - Custom schemas

**Returns:** `string` - Merged prompt text

