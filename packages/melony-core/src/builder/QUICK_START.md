# Builder API Quick Start

Get started with the Melony Builder API in 5 minutes!

## Installation

```bash
npm install melony zod
# or
pnpm add melony zod
```

## Step 1: Create Your First Widget (2 minutes)

Create a file `widgets/greeting.ts`:

```tsx
import { defineWidget, card, text, button } from "melony/builder";
import { z } from "zod";

export const GreetingWidget = defineWidget({
  type: "greeting-card",
  
  schema: z.object({
    type: z.literal("greeting-card"),
    name: z.string(),
  }),
  
  builder: (props) => 
    card({ title: "Greeting" }, [
      text({ value: `Hello, ${props.name}!`, size: "lg" }),
      button({ 
        label: "Say Hi", 
        variant: "primary",
        onClickAction: { type: "greet", payload: { name: props.name } }
      }),
    ]),
  
  examples: [
    { type: "greeting-card", name: "Alice" },
  ],
});
```

That's it! You've created a type-safe widget with full intellisense.

## Step 2: Use It in Your App (1 minute)

```tsx
import { MelonyProvider } from "melony";
import { GreetingWidget } from "./widgets/greeting";

<MelonyProvider widgets={[GreetingWidget]} onAction={handleAction}>
  {/* Your app */}
</MelonyProvider>
```

## Step 3: Configure AI (1 minute)

```tsx
import { MELONY_UI_GUIDE } from "melony/server";
import { generateWidgetSystemPrompt } from "melony/builder";
import { GreetingWidget } from "./widgets/greeting";

const systemPrompt = `${MELONY_UI_GUIDE}
${generateWidgetSystemPrompt([GreetingWidget])}`;
```

## Step 4: See It Work (1 minute)

Ask your AI: "Show me a greeting for Alice"

The AI generates:
```html
<widget type="greeting-card" name="Alice" />
```

Melony renders it as:
```
┌─────────────────────────┐
│ Greeting                │
├─────────────────────────┤
│ Hello, Alice!           │
│ [Say Hi]                │
└─────────────────────────┘
```

## What You Get

✅ **Type Safety** - Props validated by TypeScript  
✅ **Intellisense** - Autocomplete everywhere  
✅ **Auto Prompts** - AI instructions generated automatically  
✅ **Action Handling** - Built-in event system  
✅ **Zero Overhead** - Compiles to strings at build time  

## Next Steps

### Add More Complexity

```tsx
// Conditional rendering
builder: (props) => 
  card({ title: "User" }, [
    text({ value: props.name }),
    ...(props.email ? [text({ value: props.email })] : []),
  ])

// Array mapping
builder: (props) => 
  card({ title: "Items" }, 
    props.items.map(item => text({ value: item }))
  )

// Complex layouts
builder: (props) => 
  card({ title: "Dashboard" }, [
    row({ gap: "lg" }, [
      col({ flex: 2 }, [...]),
      col({ flex: 1 }, [...]),
    ]),
  ])
```

### Learn More

- [Builder API Guide](./BUILDER_GUIDE.md) - Comprehensive guide
- [Usage Example](./USAGE_EXAMPLE.md) - Real-world example
- [Examples Directory](./examples/) - More examples
- [API Reference](./README.md) - Full API docs

## Comparison: Old vs New

### Old Way (Template Strings)
```tsx
const widget: WidgetTemplate = {
  type: "greeting",
  template: `<card title="Greeting">
    <text value="Hello, {{name}}!" size="lg" />
  </card>`,
  props: [{ name: "name", type: "string", required: true }],
};
```

❌ No type safety  
❌ No intellisense  
❌ Manual prop definitions  
❌ Easy to make errors  

### New Way (Builder API)
```tsx
const widget = defineWidget({
  type: "greeting",
  schema: z.object({ name: z.string() }),
  builder: (props) => 
    card({ title: "Greeting" }, [
      text({ value: `Hello, ${props.name}!`, size: "lg" }),
    ]),
});
```

✅ Full type safety  
✅ Full intellisense  
✅ Schema-driven  
✅ Catch errors early  

## Common Patterns

### Form Widget
```tsx
defineWidget({
  type: "contact-form",
  schema: z.object({
    submitLabel: z.string().default("Submit"),
  }),
  builder: (props) => 
    card({ title: "Contact Us" }, [
      form({ onSubmitAction: { type: "contact-submit" } }, [
        input({ label: "Name", name: "name" }),
        input({ label: "Email", name: "email", inputType: "email" }),
        textarea({ label: "Message", name: "message", rows: 4 }),
        button({ label: props.submitLabel, variant: "primary" }),
      ]),
    ]),
});
```

### Data Display Widget
```tsx
defineWidget({
  type: "stats-card",
  schema: z.object({
    title: z.string(),
    value: z.number(),
    change: z.number(),
  }),
  builder: (props) => 
    card({ title: props.title }, [
      text({ value: props.value.toString(), size: "xxl", weight: "bold" }),
      badge({ 
        label: `${props.change > 0 ? '+' : ''}${props.change}%`,
        variant: props.change > 0 ? "success" : "danger",
      }),
    ]),
});
```

### List Widget
```tsx
defineWidget({
  type: "todo-list",
  schema: z.object({
    items: z.array(z.object({
      id: z.string(),
      text: z.string(),
      done: z.boolean(),
    })),
  }),
  builder: (props) => 
    card({ title: "Tasks" }, [
      list(
        props.items.map(item => 
          listItem({ 
            onClickAction: { type: "toggle-todo", payload: { id: item.id } }
          }, [
            text({ 
              value: item.text,
              color: item.done ? "muted" : "foreground",
            }),
            ...(item.done ? [badge({ label: "✓", variant: "success" })] : []),
          ])
        )
      ),
    ]),
});
```

## Tips & Tricks

1. **Use .describe() for better prompts**
   ```tsx
   z.string().describe("User's full name")
   ```

2. **Provide multiple examples**
   ```tsx
   examples: [
     { type: "widget", minimal: true },
     { type: "widget", withOptional: "value" },
   ]
   ```

3. **Use spread for conditional rendering**
   ```tsx
   ...(condition ? [component] : [])
   ```

4. **Test with console.log**
   ```tsx
   console.log(widget.template);
   console.log(widget.prompt);
   ```

5. **Extract helper functions**
   ```tsx
   function buildHeader(title: string) {
     return row({ gap: "sm" }, [...]);
   }
   ```

## Troubleshooting

**Q: Type errors in builder function?**  
A: Make sure your schema matches the props you're using.

**Q: No intellisense?**  
A: Install Zod and ensure TypeScript can infer the schema type.

**Q: Widget not rendering?**  
A: Check `widget.template` output and verify it matches expected format.

**Q: Actions not firing?**  
A: Ensure `onAction` handler is provided to `MelonyProvider`.

## Get Help

- [GitHub Issues](https://github.com/ddaras/melony/issues)
- [Discord Community](https://discord.gg/melony)
- [Documentation](https://github.com/ddaras/melony)

Happy building! 🚀

