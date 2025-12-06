# Melony

**Build AI-powered interfaces with type-safe actions, widgets, and runtime.**

Melony is a framework for building AI applications with a composable runtime, widget system, and React integration. Define actions, create widgets, and let AI generate interactive UIs.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- ⚡ **Runtime Engine** - Execute actions as async generators with automatic chaining
- 🤖 **Agent Pattern** - High-level agent abstraction with brain pattern
- 🎨 **Widget System** - Define reusable UI widgets with templates
- ⚛️ **React Integration** - Ready-to-use React components and hooks
- 🛡️ **Type Safe** - Full TypeScript support with Zod validation
- 🔄 **Framework Agnostic** - Core packages work with any framework

## Packages

Melony is organized as a monorepo with focused packages:

| Package | Description | Docs |
|---------|-------------|------|
| [`@melony/core`](./packages/melony-core) | Core types and utilities | [README](./packages/melony-core/README.md) |
| [`@melony/runtime`](./packages/melony-runtime) | Runtime engine for executing actions | [README](./packages/melony-runtime/README.md) |
| [`@melony/agents`](./packages/melony-agents) | Agent abstraction with brain pattern | [README](./packages/melony-agents/README.md) |
| [`@melony/client`](./packages/melony-client) | Framework-agnostic client | [README](./packages/melony-client/README.md) |
| [`@melony/react`](./packages/melony-react) | React components and hooks | [README](./packages/melony-react/README.md) |

## Quick Start

### 1. Install Packages

```bash
npm install @melony/react @melony/runtime @melony/agents
```

### 2. Define Actions

```typescript
// app/api/chat/route.ts
import { defineRuntime, defineAction } from "@melony/runtime";
import z from "zod";

const getWeather = defineAction({
  name: "getWeather",
  paramsSchema: z.object({ city: z.string() }),
  execute: async function* (params) {
    const weather = await fetch(`/api/weather?city=${params.city}`);
    const data = await weather.json();
    
    yield {
      type: "text",
      data: { content: `Weather in ${params.city}: ${data.temp}°F` },
    };
  },
});

const runtime = defineRuntime({
  actions: { getWeather },
  safetyMaxSteps: 10,
});
```

### 3. Create API Route

```typescript
// app/api/chat/route.ts
import { createStreamResponse } from "@melony/runtime";

export async function POST(req: Request) {
  const { message } = await req.json();
  
  const events = runtime.run({
    start: {
      action: "getWeather",
      params: { city: message.content },
    },
  });
  
  return createStreamResponse(events);
}
```

### 4. Use in React

```tsx
// app/page.tsx
"use client";
import { Chat } from "@melony/react";

export default function Home() {
  return <Chat api="/api/chat" />;
}
```

## Architecture

### Runtime → Agents → Client → React

```
┌─────────────┐
│   @melony   │  Core types & utilities
│    core     │
└──────┬──────┘
       │
       ├───┐
       │   │
┌──────▼───▼──────┐
│  @melony/      │  Runtime engine
│  runtime       │  Action execution
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  Agent abstraction
│  agents        │  Brain pattern
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  Framework-agnostic
│  client        │  Widgets, templates, transport
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  React integration
│  react         │  Components & hooks
└────────────────┘
```

## Examples

### Using Runtime Directly

```typescript
import { defineRuntime, defineAction } from "@melony/runtime";
import z from "zod";

const action = defineAction({
  name: "greet",
  paramsSchema: z.object({ name: z.string() }),
  execute: async function* (params) {
    yield { type: "text", data: { content: `Hello, ${params.name}!` } };
    return { action: "nextAction", params: {} };
  },
});

const runtime = defineRuntime({ actions: { action } });

for await (const event of runtime.run({
  start: { action: "action", params: { name: "World" } },
})) {
  console.log(event);
}
```

### Using Agents

```typescript
import { defineAgent } from "@melony/agents";
import { defineAction } from "@melony/runtime";

const agent = defineAgent({
  name: "MyAgent",
  actions: { /* your actions */ },
  brain: async function* (context, toolDefinitions, options) {
    // Your LLM logic
    // Actions automatically loop back to brain
    return { action: "someAction", params: {} };
  },
});
```

### Creating Widgets

```typescript
import { defineWidget } from "@melony/client";

const weatherWidget = defineWidget({
  tag: "weather",
  template: `
    <card title="Weather in {{city}}">
      <text value="{{temperature}}°F" />
    </card>
  `,
});
```

### React Components

```tsx
import { MelonyProvider, Chat, useMelonyChat } from "@melony/react";

function App() {
  return (
    <MelonyProvider widgets={[weatherWidget]}>
      <Chat api="/api/chat" />
    </MelonyProvider>
  );
}
```

## Development

This is a monorepo managed with pnpm and Turborepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run dev mode
pnpm dev

# Type check
pnpm typecheck

# Clean
pnpm clean
```

### Package Development

Each package has its own scripts:

```bash
cd packages/melony-runtime
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
```

## Example Apps

- [`generative-ui-template`](./apps/generative-ui-template) - Full chat interface example
- [`assistant-ui-x-melony`](./apps/assistant-ui-x-melony) - Integration with assistant-ui

## Documentation

- [Core](./packages/melony-core/README.md) - Types and utilities
- [Runtime](./packages/melony-runtime/README.md) - Runtime engine
- [Agents](./packages/melony-agents/README.md) - Agent abstraction
- [Client](./packages/melony-client/README.md) - Framework-agnostic client
- [React](./packages/melony-react/README.md) - React integration

## License

MIT © [Melony](https://github.com/ddaras/melony)
