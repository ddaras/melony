# Using Zod Schemas with Melony

This guide shows you how to define custom component schemas using Zod and automatically generate AI prompts from them.

## Benefits

- **Single Source of Truth**: Define your schema once in Zod
- **Type Safety**: Full TypeScript support for your custom components
- **Runtime Validation**: Validate AI-generated data before rendering
- **Auto-Generated Prompts**: Automatically create JSON schema prompts for the AI
- **Keep Schemas and Prompts in Sync**: No need to manually update prompt strings

## Basic Example

```tsx
import { z } from "zod";
import { 
  zodSchemaToPrompt, 
  defineComponentSchema,
  MelonyCard 
} from "melony";

// Define your component schema
const productCardSchema = z.object({
  type: z.literal("product-card"),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  inStock: z.boolean(),
  imageUrl: z.string().url().optional(),
});

// Create the schema configuration
const productCardConfig = defineComponentSchema({
  type: "product-card",
  schema: productCardSchema,
  description: `
- Displaying product information
- E-commerce catalogs
- Shopping experiences
- Product recommendations
  `,
  examples: [
    {
      type: "product-card",
      name: "Wireless Headphones",
      price: 99.99,
      description: "Premium noise-cancelling headphones with 30-hour battery life",
      inStock: true,
      imageUrl: "https://example.com/headphones.jpg"
    }
  ],
});

// Generate the prompt for AI
const aiPrompt = zodSchemaToPrompt(productCardConfig);

// Use the schema for validation
type ProductCardProps = z.infer<typeof productCardSchema>;

// Create your custom React component
const ProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  price, 
  description, 
  inStock,
  imageUrl 
}) => {
  return (
    <div className="product-card">
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <p>{description}</p>
      <span>{inStock ? "In Stock" : "Out of Stock"}</span>
    </div>
  );
};

// Use with MelonyCard
function App() {
  const aiResponse = `
    Here are some products you might like:
    
    {
      "type": "product-card",
      "name": "Smart Watch",
      "price": 249.99,
      "description": "Fitness tracking with heart rate monitor",
      "inStock": true
    }
  `;

  return (
    <MelonyCard
      text={aiResponse}
      customComponents={{
        "product-card": ProductCard
      }}
    />
  );
}

// Include the prompt in your AI system message
const systemPrompt = `
You are a helpful shopping assistant.

${aiPrompt}

When recommending products, use the product-card component.
`;
```

## Multiple Custom Components

```tsx
import { z } from "zod";
import { zodSchemasToPrompt, combinePrompts, ALL_COMPONENTS_PROMPT } from "melony";

// Define multiple schemas
const userProfileSchema = z.object({
  type: z.literal("user-profile"),
  username: z.string(),
  avatar: z.string().url().optional(),
  bio: z.string(),
  stats: z.object({
    followers: z.number(),
    following: z.number(),
    posts: z.number(),
  }),
});

const notificationSchema = z.object({
  type: z.literal("notification"),
  title: z.string(),
  message: z.string(),
  severity: z.enum(["info", "warning", "error", "success"]),
  timestamp: z.string(),
  action: z.object({
    label: z.string(),
    url: z.string(),
  }).optional(),
});

// Create configurations
const customSchemas = [
  {
    type: "user-profile",
    schema: userProfileSchema,
    description: "User profile information and social stats",
    examples: [{
      type: "user-profile",
      username: "johndoe",
      bio: "Software engineer and open source enthusiast",
      stats: {
        followers: 1234,
        following: 567,
        posts: 89
      }
    }]
  },
  {
    type: "notification",
    schema: notificationSchema,
    description: "Important notifications and alerts",
    examples: [{
      type: "notification",
      title: "New Message",
      message: "You have a new message from Alice",
      severity: "info",
      timestamp: "2 minutes ago"
    }]
  }
];

// Generate combined prompt with built-in components
const fullPrompt = combinePrompts(
  ALL_COMPONENTS_PROMPT,
  customSchemas
);

// Use in your AI system prompt
const systemPrompt = `You are a helpful assistant. ${fullPrompt}`;
```

## Advanced: Nested Schemas

```tsx
import { z } from "zod";
import { zodSchemaToPrompt } from "melony";

// Complex nested schema
const courseSchema = z.object({
  type: z.literal("course-card"),
  title: z.string(),
  instructor: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
    rating: z.number().min(0).max(5),
  }),
  modules: z.array(
    z.object({
      name: z.string(),
      duration: z.string(),
      completed: z.boolean(),
    })
  ),
  price: z.number(),
  currency: z.string().default("USD"),
  tags: z.array(z.string()),
});

const courseConfig = {
  type: "course-card",
  schema: courseSchema,
  description: "Online course information and progress tracking",
  examples: [{
    type: "course-card",
    title: "Advanced React Patterns",
    instructor: {
      name: "Jane Smith",
      rating: 4.8
    },
    modules: [
      { name: "Hooks Deep Dive", duration: "2h 30m", completed: true },
      { name: "Performance Optimization", duration: "1h 45m", completed: false }
    ],
    price: 49.99,
    currency: "USD",
    tags: ["React", "JavaScript", "Frontend"]
  }]
};

const prompt = zodSchemaToPrompt(courseConfig);
```

## Runtime Validation

```tsx
import { z } from "zod";
import { defineComponentSchema } from "melony";

const weatherSchema = z.object({
  type: z.literal("weather-widget"),
  location: z.string(),
  temperature: z.number(),
  condition: z.enum(["sunny", "cloudy", "rainy", "snowy"]),
  humidity: z.number().min(0).max(100),
  windSpeed: z.number(),
});

const weatherConfig = defineComponentSchema({
  type: "weather-widget",
  schema: weatherSchema,
  description: "Weather information display",
});

// The config now has a validate method
const WeatherWidget: React.FC<any> = (props) => {
  try {
    // Validate props at runtime
    const validatedData = weatherConfig.validate(props);
    
    return (
      <div className="weather-widget">
        <h3>{validatedData.location}</h3>
        <div>{validatedData.temperature}°F</div>
        <div>{validatedData.condition}</div>
      </div>
    );
  } catch (error) {
    console.error("Invalid weather data:", error);
    return <div>Invalid weather data</div>;
  }
};
```

## With OpenAI Function Calling

```tsx
import { z } from "zod";
import { zodSchemaToPrompt } from "melony";

const chartSchema = z.object({
  type: z.literal("analytics-chart"),
  title: z.string(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      change: z.number(),
      trend: z.enum(["up", "down", "stable"]),
    })
  ),
  timeRange: z.enum(["24h", "7d", "30d", "1y"]),
});

const chartConfig = {
  type: "analytics-chart",
  schema: chartSchema,
  description: "Analytics dashboard charts",
};

// Use with OpenAI
import OpenAI from "openai";

const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: `You are an analytics assistant. ${zodSchemaToPrompt(chartConfig)}`
    },
    {
      role: "user",
      content: "Show me the user engagement metrics"
    }
  ],
});
```

## Best Practices

1. **Always include the `type` field** in your schema as a literal value
2. **Use descriptive examples** - they help the AI understand the expected format
3. **Add descriptions** to explain when to use each component
4. **Validate data at runtime** using the schema before rendering
5. **Combine built-in and custom prompts** using `combinePrompts()`
6. **Keep schemas focused** - one schema per component type
7. **Use TypeScript inference** with `z.infer<>` for type safety

## Generated Prompt Format

When you call `zodSchemaToPrompt()`, it generates a prompt like this:

```
To display a product-card, use this JSON format:
{
  "type": "product-card",
  "name": "Wireless Headphones",
  "price": 99.99,
  "description": "Premium noise-cancelling headphones",
  "inStock": true
}

JSON Schema:
{
  "type": "object",
  "properties": {
    "type": { "type": "string", "const": "product-card" },
    "name": { "type": "string" },
    "price": { "type": "number" },
    "description": { "type": "string" },
    "inStock": { "type": "boolean" }
  },
  "required": ["type", "name", "price", "description", "inStock"]
}

Use the product-card component for:
- Displaying product information
- E-commerce catalogs
```

This gives the AI both:
- A concrete example to follow
- A formal JSON schema for structure validation

