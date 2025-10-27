# Builder API Usage Example

This file demonstrates a complete, real-world usage of the Melony Builder API.

## Complete Example: E-Commerce Product Widget

```tsx
// product-widget.ts
import { defineWidget, card, row, col, text, image, badge, button, divider } from "melony/builder";
import { z } from "zod";

// Step 1: Define the schema with descriptions for better AI prompts
const productSchema = z.object({
  type: z.literal("product-card"),
  
  // Basic info
  name: z.string().describe("Product name"),
  price: z.number().describe("Price in USD"),
  image: z.string().url().describe("Product image URL"),
  
  // Optional details
  description: z.string().optional().describe("Product description"),
  rating: z.number().min(0).max(5).optional().describe("Product rating (0-5)"),
  reviewCount: z.number().optional().describe("Number of reviews"),
  inStock: z.boolean().default(true).describe("Whether product is in stock"),
  discount: z.number().min(0).max(100).optional().describe("Discount percentage"),
  
  // Category tags
  tags: z.array(z.string()).optional().describe("Product tags/categories"),
});

// Step 2: Define the widget with the builder function
export const ProductWidget = defineWidget({
  type: "product-card",
  name: "Product Card",
  description: "Display e-commerce product information with images, pricing, and purchase options",
  schema: productSchema,
  
  // Step 3: Build the UI with type-safe functions
  builder: (props) => {
    // Calculate discounted price
    const finalPrice = props.discount 
      ? props.price * (1 - props.discount / 100)
      : props.price;
    
    const hasDiscount = props.discount && props.discount > 0;
    
    return card(
      { title: props.name, size: "lg" },
      [
        // Product Image
        image({ 
          src: props.image, 
          alt: props.name, 
          size: "lg" 
        }),
        
        // Price Section with Discount Badge
        row(
          { gap: "md", align: "center", justify: "between" },
          [
            col({ gap: "xs" }, [
              // Current/Discounted Price
              text({ 
                value: `$${finalPrice.toFixed(2)}`, 
                size: "xl", 
                weight: "bold" 
              }),
              
              // Original Price (if discounted)
              ...(hasDiscount 
                ? [row({ gap: "sm", align: "center" }, [
                    text({ 
                      value: `$${props.price.toFixed(2)}`, 
                      size: "sm", 
                      color: "muted" 
                    }),
                    badge({ 
                      label: `${props.discount}% OFF`, 
                      variant: "danger" 
                    }),
                  ])]
                : []
              ),
            ]),
            
            // Stock Badge
            badge({
              label: props.inStock ? "In Stock" : "Out of Stock",
              variant: props.inStock ? "success" : "danger"
            }),
          ]
        ),
        
        // Rating Section (if available)
        ...(props.rating !== undefined
          ? [row({ gap: "xs", align: "center" }, [
              text({ value: "⭐".repeat(Math.round(props.rating)) }),
              text({ 
                value: `${props.rating.toFixed(1)}`, 
                size: "sm", 
                weight: "bold" 
              }),
              ...(props.reviewCount 
                ? [text({ 
                    value: `(${props.reviewCount} reviews)`, 
                    size: "sm", 
                    color: "muted" 
                  })]
                : []
              ),
            ])]
          : []
        ),
        
        // Description
        ...(props.description
          ? [text({ value: props.description, color: "muted" })]
          : []
        ),
        
        // Tags
        ...(props.tags && props.tags.length > 0
          ? [
              divider({ orientation: "horizontal" }),
              row(
                { gap: "xs", wrap: "wrap" },
                props.tags.map(tag => 
                  badge({ label: tag, variant: "secondary" })
                )
              ),
            ]
          : []
        ),
        
        // Action Buttons
        divider({ orientation: "horizontal" }),
        row({ gap: "sm" }, [
          button({
            label: props.inStock ? "Add to Cart" : "Notify When Available",
            variant: props.inStock ? "primary" : "secondary",
            flex: 2,
            onClickAction: {
              type: props.inStock ? "add-to-cart" : "notify-me",
              payload: {
                productName: props.name,
                price: finalPrice,
                inStock: props.inStock,
              }
            }
          }),
          button({
            label: "❤️",
            variant: "outline",
            flex: 1,
            onClickAction: {
              type: "add-to-wishlist",
              payload: { productName: props.name }
            }
          }),
        ]),
      ]
    );
  },
  
  // Step 4: Provide examples for the AI to learn from
  examples: [
    // Example 1: Full-featured product
    {
      type: "product-card",
      name: "Wireless Noise-Cancelling Headphones",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life",
      rating: 4.8,
      reviewCount: 2847,
      inStock: true,
      discount: 20,
      tags: ["Electronics", "Audio", "Premium"],
    },
    
    // Example 2: Simple product
    {
      type: "product-card",
      name: "USB-C Cable",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
      description: "Durable braided USB-C to USB-C cable, 6ft length",
      inStock: true,
      tags: ["Accessories"],
    },
    
    // Example 3: Out of stock product
    {
      type: "product-card",
      name: "Limited Edition Smartwatch",
      price: 399.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      description: "Exclusive limited edition with custom band",
      rating: 4.9,
      reviewCount: 156,
      inStock: false,
      tags: ["Wearables", "Limited Edition"],
    },
  ],
  
  // Step 5: Optional default props
  defaultProps: {
    type: "product-card",
    name: "Product",
    price: 0,
    image: "https://via.placeholder.com/400",
    inStock: true,
  },
});

// The widget is now ready to use!
console.log("Generated template:", ProductWidget.template);
console.log("Generated AI prompt:", ProductWidget.prompt);
```

## Using the Widget in Your App

```tsx
// app.tsx
import { MelonyProvider, MelonyMarkdown } from "melony";
import { ProductWidget } from "./widgets/product-widget";
import { useChat } from "ai/react";

export default function App() {
  const { messages } = useChat({ api: "/api/chat" });
  
  return (
    <MelonyProvider widgets={[ProductWidget]}>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "assistant" ? (
            <MelonyMarkdown>{message.content}</MelonyMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      ))}
    </MelonyProvider>
  );
}
```

## Server Setup with AI Prompt

```tsx
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { MELONY_UI_GUIDE } from "melony/server";
import { generateWidgetSystemPrompt } from "melony/builder";
import { ProductWidget } from "@/widgets/product-widget";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Combine base Melony prompt with custom widget prompts
  const systemPrompt = `${MELONY_UI_GUIDE}

${generateWidgetSystemPrompt([ProductWidget])}

You can now use the product-card widget to display products!`;

  const result = streamText({
    model: openai("gpt-4"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
```

## What the AI Will Generate

When a user asks "Show me the wireless headphones", the AI will generate:

```html
<widget 
  type="product-card" 
  name="Wireless Noise-Cancelling Headphones"
  price="299.99"
  image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
  description="Premium over-ear headphones with active noise cancellation"
  rating="4.8"
  reviewCount="2847"
  inStock="true"
  discount="20"
  tags='["Electronics", "Audio", "Premium"]'
/>
```

And Melony will render it as a beautiful, interactive product card!

## Key Takeaways

1. **Type Safety**: The builder ensures you can't make mistakes with props
2. **Intellisense**: Full autocomplete in your IDE
3. **Conditional Logic**: Use JavaScript naturally for dynamic UIs
4. **Auto-Generated Prompts**: The AI learns from your examples
5. **No Runtime Cost**: Everything compiles to efficient template strings
6. **Easy Testing**: Test the builder function directly with example props

## Next Steps

- Try modifying the product widget
- Create your own widgets for your use case
- Explore the [examples directory](/src/builder/examples/)
- Read the [full Builder API docs](/src/builder/README.md)

