# Melony Builder API Guide

The Builder API is a revolutionary way to build Melony widgets with **full type safety**, **intellisense**, and **zero runtime overhead**.

## Table of Contents

- [Why Builder API?](#why-builder-api)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Complete Example](#complete-example)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

## Why Builder API?

### The Problem

Building widgets with template strings is error-prone and lacks developer tools support:

```tsx
// ❌ Problems with template strings:
// - No type checking
// - No autocomplete
// - Easy to make syntax errors
// - Hard to maintain
// - No conditional logic support

const widget: WidgetTemplate = {
  type: "weather",
  template: `<card title="{{location}} Weather">
    <row gap="md">
      <text value="{{temperature}}°F" size="xl" weight="bold" />
      <badge label="{{condition}}" variant="primary" />
    </row>
  </card>`,
  props: [
    { name: "location", type: "string", required: true },
    { name: "temperature", type: "number", required: true },
  ],
};
```

### The Solution

The Builder API provides a type-safe, JSX-like experience:

```tsx
// ✅ Builder API benefits:
// - Full TypeScript type checking
// - Intellisense for all props
// - Compile-time validation
// - JavaScript logic support
// - Auto-generated AI prompts

import { defineWidget, card, row, text, badge } from "melony/builder";
import { z } from "zod";

export const WeatherWidget = defineWidget({
  type: "weather-card",
  schema: z.object({
    type: z.literal("weather-card"),
    location: z.string(),
    temperature: z.number(),
    condition: z.string(),
  }),
  
  // Type-safe builder with full intellisense!
  builder: (props) => 
    card({ title: `${props.location} Weather` }, [
      row({ gap: "md" }, [
        text({ value: `${props.temperature}°F`, size: "xl", weight: "bold" }),
        badge({ label: props.condition, variant: "primary" }),
      ]),
    ]),
});
```

## Quick Start

### Installation

The Builder API is included in `melony-core`. No additional installation needed!

```bash
pnpm add melony
```

### Your First Widget

1. **Import the builder functions:**

```tsx
import { defineWidget, card, row, col, text, badge, button } from "melony/builder";
import { z } from "zod";
```

2. **Define your schema:**

```tsx
const productSchema = z.object({
  type: z.literal("product-card"),
  name: z.string().describe("Product name"),
  price: z.number().describe("Price in USD"),
  description: z.string().optional(),
  inStock: z.boolean().default(true),
});
```

3. **Build your widget:**

```tsx
export const ProductWidget = defineWidget({
  type: "product-card",
  name: "Product Card",
  description: "Display product information",
  schema: productSchema,
  
  builder: (props) => {
    return card({ title: props.name, size: "md" }, [
      row({ gap: "sm", align: "center", justify: "between" }, [
        text({ value: `$${props.price}`, size: "xl", weight: "bold" }),
        badge({ 
          label: props.inStock ? "In Stock" : "Out of Stock",
          variant: props.inStock ? "success" : "danger"
        }),
      ]),
      
      ...(props.description 
        ? [text({ value: props.description, color: "muted" })]
        : []
      ),
      
      button({
        label: props.inStock ? "Add to Cart" : "Notify Me",
        variant: props.inStock ? "primary" : "secondary",
        onClickAction: {
          type: "add-to-cart",
          payload: { productName: props.name, price: props.price }
        }
      }),
    ]);
  },
  
  examples: [
    {
      type: "product-card",
      name: "Wireless Headphones",
      price: 99.99,
      description: "Premium noise-cancelling headphones",
      inStock: true,
    },
  ],
});
```

4. **Use it in your app:**

```tsx
import { MelonyProvider } from "melony";
import { ProductWidget } from "./widgets/product";

// Widget is automatically compiled!
console.log(ProductWidget.template); // Template string for AI
console.log(ProductWidget.prompt);   // AI prompt

<MelonyProvider widgets={[ProductWidget]}>
  {/* Your app */}
</MelonyProvider>
```

## Core Concepts

### 1. Builder Functions

Each Melony component has a corresponding builder function:

```tsx
// Layout
card({ title: "Title" }, children)
row({ gap: "md" }, children)
col({ gap: "sm" }, children)

// Typography
text({ value: "Hello", size: "lg" })
heading({ value: "Title", level: 2 })

// Forms
input({ label: "Email", inputType: "email" })
button({ label: "Submit", variant: "primary" })

// Content
image({ src: "...", alt: "..." })
badge({ label: "New", variant: "success" })
```

### 2. Type Safety

Props are inferred from your Zod schema:

```tsx
const schema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

defineWidget({
  schema,
  builder: (props) => {
    // props.name is string ✓
    // props.age is number ✓
    // props.email is string ✓
    // props.invalid causes error ✗
  },
});
```

### 3. Conditional Rendering

Use JavaScript logic naturally:

```tsx
builder: (props) => {
  return card({ title: "Profile" }, [
    text({ value: props.name }),
    
    // Conditional
    ...(props.showEmail 
      ? [text({ value: props.email })]
      : []
    ),
    
    // Ternary
    props.isAdmin
      ? button({ label: "Admin Panel" })
      : button({ label: "Settings" }),
    
    // Map arrays
    ...props.tags.map(tag => 
      badge({ label: tag })
    ),
  ]);
}
```

### 4. Action Handling

Define actions with type safety:

```tsx
button({
  label: "Save",
  onClickAction: {
    type: "save-data",
    payload: {
      userId: props.userId,
      timestamp: Date.now()
    }
  }
})

form({
  onSubmitAction: {
    type: "form-submit",
    payload: { formId: "user-settings" }
  }
}, children)
```

## Complete Example

Here's a full-featured user profile widget:

```tsx
import { defineWidget, card, row, col, text, image, button, form, input, textarea, divider } from "melony/builder";
import { z } from "zod";

// Schema
const profileSchema = z.object({
  type: z.literal("user-profile"),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  role: z.string().optional(),
  editable: z.boolean().optional(),
});

// Widget
export const UserProfileWidget = defineWidget({
  type: "user-profile",
  name: "User Profile",
  description: "Display and edit user profiles",
  schema: profileSchema,
  
  builder: (props) => {
    // Editable mode
    if (props.editable) {
      return card({ title: "Edit Profile", size: "lg" }, [
        form({ onSubmitAction: { type: "update-profile" } }, [
          row({ gap: "md", align: "center" }, [
            ...(props.avatar 
              ? [image({ src: props.avatar, alt: props.name, size: "md" })]
              : []
            ),
            col({ gap: "sm", flex: 1 }, [
              input({ label: "Name", name: "name", defaultValue: props.name }),
              input({ label: "Email", name: "email", inputType: "email", defaultValue: props.email }),
            ]),
          ]),
          
          input({ label: "Role", name: "role", defaultValue: props.role }),
          textarea({ label: "Bio", name: "bio", rows: 4, defaultValue: props.bio }),
          
          row({ gap: "sm", justify: "end" }, [
            button({ label: "Cancel", variant: "secondary" }),
            button({ label: "Save", variant: "primary" }),
          ]),
        ]),
      ]);
    }
    
    // View mode
    return card({ title: "Profile" }, [
      row({ gap: "md", align: "center" }, [
        ...(props.avatar 
          ? [image({ src: props.avatar, alt: props.name, size: "md" })]
          : []
        ),
        col({ gap: "xs", flex: 1 }, [
          text({ value: props.name, size: "lg", weight: "bold" }),
          text({ value: props.email, color: "muted" }),
          ...(props.role 
            ? [text({ value: props.role, color: "primary", size: "sm" })]
            : []
          ),
        ]),
      ]),
      
      ...(props.bio 
        ? [
            divider({ orientation: "horizontal" }),
            text({ value: props.bio, color: "muted" }),
          ]
        : []
      ),
      
      button({
        label: "Edit Profile",
        variant: "outline",
        fullWidth: true,
        onClickAction: { type: "edit-profile", payload: { email: props.email } }
      }),
    ]);
  },
  
  examples: [
    {
      type: "user-profile",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "Software engineer passionate about AI",
      role: "Senior Engineer",
    },
  ],
});
```

## Migration Guide

### From Template Strings

**Before:**

```tsx
const widget: WidgetTemplate = {
  type: "greeting",
  template: `<card title="Greeting">
    <text value="Hello, {{name}}!" size="lg" />
    <button label="Say Hi" onClickAction='{"type": "greet"}' />
  </card>`,
  props: [
    { name: "name", type: "string", required: true },
  ],
};
```

**After:**

```tsx
const widget = defineWidget({
  type: "greeting",
  schema: z.object({
    type: z.literal("greeting"),
    name: z.string(),
  }),
  builder: (props) => card({ title: "Greeting" }, [
    text({ value: `Hello, ${props.name}!`, size: "lg" }),
    button({ label: "Say Hi", onClickAction: { type: "greet" } }),
  ]),
});
```

### Step-by-Step Migration

1. **Install dependencies:**
```bash
pnpm add zod
```

2. **Convert props to Zod schema:**
```tsx
// Before
props: [
  { name: "title", type: "string", required: true },
  { name: "count", type: "number", required: false },
]

// After
schema: z.object({
  type: z.literal("my-widget"),
  title: z.string(),
  count: z.number().optional(),
})
```

3. **Convert template to builder:**
```tsx
// Before
template: `<card title="{{title}}">
  <text value="Count: {{count}}" />
</card>`

// After
builder: (props) => card({ title: props.title }, [
  text({ value: `Count: ${props.count}` }),
])
```

4. **Test the output:**
```tsx
console.log(widget.template); // Should match old template
console.log(widget.prompt);   // New AI prompt
```

## Best Practices

### 1. Use Descriptive Schema Descriptions

```tsx
z.object({
  email: z.string().email().describe("User's email address"),
  age: z.number().min(0).max(120).describe("User's age in years"),
})
```

### 2. Provide Multiple Examples

```tsx
defineWidget({
  // ...
  examples: [
    // Minimal example
    { type: "widget", name: "John" },
    // Full example
    { type: "widget", name: "Jane", age: 30, bio: "Developer" },
    // Edge case
    { type: "widget", name: "Bob", age: null },
  ],
})
```

### 3. Use Conditional Rendering

```tsx
builder: (props) => card({ title: "Data" }, [
  ...(props.items.length > 0
    ? props.items.map(item => text({ value: item }))
    : [text({ value: "No items", color: "muted" })]
  ),
])
```

### 4. Keep Widgets Focused

```tsx
// ✓ Good - focused widget
const ProductCardWidget = defineWidget({ ... })

// ✗ Bad - trying to do too much
const EverythingWidget = defineWidget({ ... })
```

### 5. Extract Reusable Logic

```tsx
// Helper function
function renderUserHeader(user: User) {
  return row({ gap: "md" }, [
    image({ src: user.avatar }),
    text({ value: user.name }),
  ]);
}

// Use in multiple widgets
builder: (props) => card({}, [
  renderUserHeader(props.user),
  // ...
])
```

## Troubleshooting

### TypeScript Errors

**Problem:** "Type 'X' is not assignable to type 'Y'"

**Solution:** Check your schema matches the builder props:
```tsx
// Schema
z.object({ count: z.number() })

// Builder must use number, not string
builder: (props) => text({ value: props.count.toString() }) // ✓
builder: (props) => text({ value: props.count }) // ✗
```

### Missing Intellisense

**Problem:** No autocomplete in builder function

**Solution:** Ensure TypeScript can infer the schema type:
```tsx
// ✗ Type not inferred
const schema = z.object({ ... });
defineWidget({ schema, ... })

// ✓ Type inferred
const schema = z.object({ ... }) as const;
defineWidget({ schema, ... })
```

### Template Generation Issues

**Problem:** Generated template looks wrong

**Solution:** Debug with compiler functions:
```tsx
import { compileToTemplate, prettyPrint } from "melony/builder";

const node = builder(exampleProps);
console.log(compileToTemplate(node));
console.log(prettyPrint(compileToTemplate(node)));
```

## Next Steps

- Explore [examples](/src/builder/examples/)
- Read the [Builder API Reference](/src/builder/README.md)
- Check out [best practices](#best-practices)
- Join our [Discord community](https://discord.gg/melony)

## Feedback

Have questions or suggestions? Open an issue on [GitHub](https://github.com/ddaras/melony/issues)!

