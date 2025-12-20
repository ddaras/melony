# Melony 🍈

The universal AI agent framework with built-in **Server-Driven UI (SDUI)** and **Human-in-the-Loop (HITL)** support.

## Features

- 🚀 **Killer DX**: Define agents and actions in seconds.
- 🎨 **Universal UI**: Push React components directly from your backend actions.
- 🤝 **HITL Native**: Built-in approval flows for sensitive actions.
- 📦 **Consolidated**: One package for runtime, client, and adapters.

## Installation

```bash
npm install melony
```

## Quick Start

### 1. Define your Assistant

```typescript
import { melony, ui } from 'melony';
import { z } from 'zod';

export const assistant = melony({
  name: "ShopAssistant",
  
  actions: {
    searchProducts: {
      paramsSchema: z.object({ query: z.string() }),
      execute: async function* (params, { ui }) {
        yield ui.text(`Searching for ${params.query}...`);
        // Return SDUI directly
        yield ui.card({
          title: "Results",
          children: [ui.text("Product A - $10")]
        });
      }
    }
  },

  onMessage: async function* (message, context) {
    // Decision logic here
    return { action: "searchProducts", params: { query: "shoes" } };
  }
});
```

### 2. Deploy with Hono

```typescript
import { handle } from 'melony/adapters/hono';
import { assistant } from './assistant';

app.post('/api/chat', handle(assistant));
```

### 3. Connect from React

```tsx
import { Client, createHttpTransport } from 'melony/client';
import { MelonyProvider, Thread } from '@melony/react';

const client = new Client(createHttpTransport('/api/chat'));

function App() {
  return (
    <MelonyProvider client={client}>
      <Thread />
    </MelonyProvider>
  );
}
```

## License

MIT
