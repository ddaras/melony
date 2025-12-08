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
npm install @melony/react @melony/runtime @melony/agents @melony/client
```

### 2. Define Actions

```typescript
// lib/actions.ts
import { defineAction } from "@melony/runtime";
import z from "zod";

export const getWeather = defineAction({
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
```

### 3. Create Agent with Brain

```typescript
// lib/agent-brain.ts
import { RuntimeContext, NextAction, MelonyEvent } from "@melony/core";
import { ToolDefinition } from "@melony/agents";
import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function* agentBrain(
  context: RuntimeContext,
  toolDefinitions: ToolDefinition[],
  options: { input?: string }
): AsyncGenerator<MelonyEvent, NextAction | void, unknown> {
  // Convert tools to AI SDK format
  const tools = Object.fromEntries(
    toolDefinitions.map((toolDef) => [
      toolDef.name,
      {
        description: toolDef.description,
        inputSchema: context.actions[toolDef.name]?.paramsSchema,
      },
    ])
  );

  // Call LLM with streaming
  const result = streamText({
    model: openai("gpt-4"),
    messages: [{ role: "user", content: options.input || "" }],
    tools,
  });

  // Stream text events
  for await (const chunk of result.toUIMessageStream()) {
    if (chunk.type === "text-delta") {
      yield { type: "text", data: { content: chunk.delta } };
    }
  }

  // Return next action based on tool calls
  const finalResult = await result;
  const toolCalls = await finalResult.toolCalls;
  if (toolCalls?.length > 0) {
    return { action: toolCalls[0].toolName, params: toolCalls[0].input || {} };
  }
}
```

### 4. Create API Route

```typescript
// app/api/chat/route.ts
import { defineAgent, createAgentHandler } from "@melony/agents";
import { getWeather } from "@/lib/actions";
import { agentBrain } from "@/lib/agent-brain";

const agent = defineAgent({
  name: "Assistant",
  actions: { getWeather },
  brain: agentBrain,
});

// createAgentHandler handles message parsing, approvals, and routing automatically
export const POST = createAgentHandler(agent);
```

### 5. Use in React

```tsx
// app/page.tsx
"use client";
import { MelonyStoreProvider, Chat } from "@melony/react";

export default function Home() {
  return (
    <MelonyStoreProvider api="/api/chat">
      <Chat />
    </MelonyStoreProvider>
  );
}
```

## Architecture

### Core → Runtime → Agents → Client → React

```
┌─────────────┐
│   @melony   │  Core types & utilities
│    core     │  Event types, message parsing
└──────┬──────┘
       │
       ├───┐
       │   │
┌──────▼───▼──────┐
│  @melony/      │  Runtime engine
│  runtime       │  Action execution & chaining
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  Agent abstraction
│  agents        │  Brain pattern, handler creation
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  Framework-agnostic client
│  client        │  Widgets, templates, transport, runtime client
└──────┬─────────┘
       │
┌──────▼──────────┐
│  @melony/      │  React integration
│  react         │  Components, hooks, store provider
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
import { defineAgent, createAgentHandler } from "@melony/agents";
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

// Create HTTP handler - handles message parsing, approvals, routing
export const POST = createAgentHandler(agent);
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
import { MelonyStoreProvider, Chat, useMelony } from "@melony/react";

function App() {
  return (
    <MelonyStoreProvider api="/api/chat">
      <Chat />
    </MelonyStoreProvider>
  );
}

// Access store state and dispatch events
function CustomComponent() {
  const { messages, isLoading, dispatchEvent } = useMelony();
  
  return (
    <div>
      {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
    </div>
  );
}
```

### Using Runtime Client (Framework Agnostic)

```typescript
import { MelonyRuntimeClient, createHttpTransport } from "@melony/client";

const client = new MelonyRuntimeClient({
  transport: createHttpTransport("/api/chat"),
});

// Subscribe to state changes
client.subscribe((state) => {
  console.log("Events:", state.events);
  console.log("Messages:", state.messages);
  console.log("Loading:", state.isLoading);
});

// Send message and stream events
for await (const event of client.sendMessage({
  role: "user",
  content: [{ type: "text", data: { content: "Hello" } }],
})) {
  console.log("Event:", event);
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

- [`generative-ui-template`](./apps/generative-ui-template) - Full chat interface with agent example

## Documentation

- [Core](./packages/melony-core/README.md) - Types and utilities
- [Runtime](./packages/melony-runtime/README.md) - Runtime engine
- [Agents](./packages/melony-agents/README.md) - Agent abstraction
- [Client](./packages/melony-client/README.md) - Framework-agnostic client
- [React](./packages/melony-react/README.md) - React integration

## License

MIT © [Melony](https://github.com/ddaras/melony)
