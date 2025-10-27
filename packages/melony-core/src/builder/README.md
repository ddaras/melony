# Melony Builder API

The Builder API provides a type-safe, JSX-like way to build Melony widgets with full TypeScript support and intellisense.

## Why Use the Builder API?

Instead of writing HTML-like template strings manually:

```tsx
// ❌ Old way - no type safety, no intellisense
const weatherWidget: WidgetTemplate = {
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

Use the Builder API with full type safety:

```tsx
// ✅ New way - type-safe with intellisense!
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
  
  builder: (props) => 
    card({ title: `${props.location} Weather` }, [
      row({ gap: "md" }, [
        text({ value: `${props.temperature}°F`, size: "xl", weight: "bold" }),
        badge({ label: props.condition, variant: "primary" }),
      ]),
    ]),
});
```

## Benefits

- ✅ **Full Type Safety** - Props are inferred from Zod schema
- ✅ **Intellisense** - Autocomplete for all component props
- ✅ **Compile-time Validation** - Catch errors before runtime
- ✅ **Auto-generate Prompts** - AI prompts generated from schema
- ✅ **Conditional Rendering** - Use JavaScript logic for dynamic UIs
- ✅ **No Runtime Overhead** - Compiles to template strings

## Quick Start

### 1. Define Your Schema

Use Zod to define your widget's props:

```tsx
import { z } from "zod";

const weatherSchema = z.object({
  type: z.literal("weather-card"),
  location: z.string().describe("City and state"),
  temperature: z.number().describe("Temperature in Fahrenheit"),
  condition: z.string().describe("Weather condition"),
  humidity: z.number().optional(),
});
```

### 2. Build Your Widget

Use builder functions to create your UI:

```tsx
import { defineWidget, card, row, text, badge } from "melony/builder";

export const WeatherWidget = defineWidget({
  type: "weather-card",
  name: "Weather Card",
  description: "Display weather information",
  schema: weatherSchema,
  
  builder: (props) => {
    return card({ title: `${props.location} Weather` }, [
      row({ gap: "md", align: "center" }, [
        text({ value: `${props.temperature}°F`, size: "xl", weight: "bold" }),
        badge({ label: props.condition, variant: "primary" }),
      ]),
      
      // Conditional rendering
      ...(props.humidity 
        ? [text({ value: `Humidity: ${props.humidity}%`, color: "muted" })]
        : []
      ),
    ]);
  },
  
  examples: [
    { type: "weather-card", location: "NYC", temperature: 72, condition: "Sunny" },
  ],
});
```

### 3. Use Your Widget

```tsx
import { MelonyProvider } from "melony";
import { WeatherWidget } from "./widgets/weather";

// The widget is automatically compiled to a template
console.log(WeatherWidget.template);
console.log(WeatherWidget.prompt); // AI prompt

// Use in your app
<MelonyProvider widgets={[WeatherWidget]}>
  {/* Your app */}
</MelonyProvider>
```

## Available Components

### Layout Components

```tsx
import { card, row, col, box, list, listItem } from "melony/builder";

// Card - Root container (required)
card({ title: "Title", subtitle: "Subtitle", size: "lg" }, children);

// Row - Horizontal layout
row({ gap: "md", align: "center", justify: "between" }, children);

// Col - Vertical layout
col({ gap: "sm", align: "start", justify: "center" }, children);

// List
list([
  listItem({ gap: "md", onClickAction: { type: "item-clicked" } }, children),
]);
```

### Typography

```tsx
import { text, heading } from "melony/builder";

text({ value: "Hello", size: "lg", weight: "bold", color: "primary" });
heading({ value: "Title", level: 2 });
```

### Form Components

```tsx
import { form, input, textarea, select, checkbox, radioGroup, button } from "melony/builder";

form({ onSubmitAction: { type: "submit" } }, [
  input({ 
    label: "Email",
    inputType: "email",
    name: "email",
    placeholder: "Enter email",
    onChangeAction: { type: "email-changed" }
  }),
  
  textarea({ 
    label: "Message",
    rows: 4,
    name: "message"
  }),
  
  select({
    label: "Category",
    options: [
      { label: "Bug", value: "bug" },
      { label: "Feature", value: "feature" },
    ],
  }),
  
  checkbox({ label: "I agree", name: "agree" }),
  
  radioGroup({
    name: "priority",
    options: [
      { label: "Low", value: "low" },
      { label: "High", value: "high" },
    ],
  }),
  
  button({ label: "Submit", variant: "primary" }),
]);
```

### Content Components

```tsx
import { image, icon, badge } from "melony/builder";

image({ src: "https://...", alt: "Description", size: "md" });
icon({ name: "Check", size: "lg", color: "success" });
badge({ label: "New", variant: "primary" });
```

### Utility Components

```tsx
import { spacer, divider } from "melony/builder";

spacer({ size: "lg" });
divider({ orientation: "horizontal" });
```

### Data Visualization

```tsx
import { chart } from "melony/builder";

chart({
  type: "bar",
  data: [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 150 },
  ],
  xKey: "name",
  yKeys: ["value"],
  height: 300,
});
```

## Advanced Features

### Conditional Rendering

Use JavaScript logic for dynamic UIs:

```tsx
builder: (props) => {
  return card({ title: "User Profile" }, [
    text({ value: props.name }),
    
    // Show email only if provided
    ...(props.email 
      ? [text({ value: props.email, color: "muted" })]
      : []
    ),
    
    // Different button based on status
    props.isAdmin
      ? button({ label: "Admin Panel", variant: "primary" })
      : button({ label: "Edit Profile", variant: "secondary" }),
  ]);
}
```

### Array Mapping

```tsx
builder: (props) => {
  return card({ title: "Team Members" }, [
    list(
      props.members.map((member) =>
        listItem({ gap: "md" }, [
          text({ value: member.name, weight: "bold" }),
          text({ value: member.role, color: "muted" }),
        ])
      )
    ),
  ]);
}
```

### Complex Layouts

```tsx
builder: (props) => {
  return card({ title: "Dashboard" }, [
    row({ gap: "lg" }, [
      // Left column
      col({ gap: "md", flex: 2 }, [
        text({ value: "Main Content" }),
        // ... more components
      ]),
      
      // Right sidebar
      col({ gap: "sm", flex: 1 }, [
        text({ value: "Sidebar" }),
        // ... more components
      ]),
    ]),
  ]);
}
```

### Action Handling

```tsx
button({
  label: "Click Me",
  onClickAction: {
    type: "button-clicked",
    payload: { userId: props.userId, action: "save" }
  }
});

form({
  onSubmitAction: {
    type: "form-submitted",
    payload: { formId: "user-profile" }
  }
}, children);
```

## API Reference

### defineWidget()

Define a widget with schema and builder function.

```tsx
function defineWidget<TSchema extends z.ZodType>(
  definition: WidgetDefinition<TSchema>
): CompiledWidget;
```

**Parameters:**
- `type` - Unique widget type identifier
- `name` - Human-readable name
- `description` - Widget description for AI
- `schema` - Zod schema for props
- `builder` - Function that builds the widget UI
- `examples` - Example props for AI (optional)
- `defaultProps` - Default prop values (optional)

**Returns:** `CompiledWidget` with:
- `template` - Generated HTML-like template string
- `prompt` - Generated AI prompt
- All other WidgetTemplate properties

### zodSchemaToPrompt()

Generate AI prompt from Zod schema.

```tsx
function zodSchemaToPrompt(config: PromptConfig): string;
```

### compileToTemplate()

Compile a builder node to template string.

```tsx
function compileToTemplate(node: BuilderNode): string;
```

### generateWidgetSystemPrompt()

Generate system prompt for multiple widgets.

```tsx
function generateWidgetSystemPrompt(widgets: CompiledWidget[]): string;
```

## Examples

See the `/examples` directory for complete examples:
- `weather-widget.ts` - Weather display
- `user-profile-widget.ts` - User profile with forms
- `chart-widget.ts` - Data visualization

## Migration from Template Strings

If you have existing template strings, you can migrate gradually:

```tsx
// Before
const widget: WidgetTemplate = {
  type: "my-widget",
  template: `<card title="Hello"><text value="World" /></card>`,
  props: [...],
};

// After
const widget = defineWidget({
  type: "my-widget",
  schema: z.object({ ... }),
  builder: (props) => card({ title: "Hello" }, [
    text({ value: "World" }),
  ]),
});
```

## TypeScript Tips

### Type Inference

Props are automatically inferred from the schema:

```tsx
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

defineWidget({
  schema,
  builder: (props) => {
    // props.name is string
    // props.age is number
    // Full intellisense!
  },
});
```

### Custom Types

Define reusable types:

```tsx
import { CardProps, RowProps, TextProps } from "melony/builder";

const myCardProps: CardProps = {
  title: "Hello",
  size: "lg",
};
```

## Best Practices

1. **Use descriptive schema descriptions** - They help generate better AI prompts
2. **Provide examples** - AI learns from examples
3. **Keep widgets focused** - One widget, one purpose
4. **Use conditional rendering** - Make widgets flexible
5. **Test with compiled output** - Check generated templates

## Troubleshooting

### Type Errors

If you get type errors, ensure:
- Zod schema matches your props
- All required props are provided
- Props match component signatures

### Template Generation

If templates look wrong:
- Check the compiled output with `console.log(widget.template)`
- Verify builder function returns valid BuilderNode
- Use `validateBuilderNode()` to check structure

## Contributing

Found a bug or have a feature request? Open an issue on GitHub!

