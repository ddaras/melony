# @melony/agents

Agent abstraction with brain pattern for building AI agents with Melony.

## Overview

Provides a high-level `Agent` class that wraps the runtime with a "brain" abstraction. Actions automatically loop back to the brain after execution, allowing the brain to decide the next step.

## Usage

```typescript
import { defineAgent } from "@melony/agents";
import { defineAction } from "@melony/runtime";
import z from "zod";

const getWeather = defineAction({
  name: "getWeather",
  paramsSchema: z.object({ city: z.string() }),
  execute: async function* (params) {
    const weather = await fetchWeather(params.city);
    yield { type: "message", data: { content: `Weather: ${weather}` } };
    return { description: `Fetched weather for ${params.city}` };
  },
});

const agent = defineAgent({
  name: "WeatherAgent",
  actions: { getWeather },
  brain: async function* (context, toolDefinitions, options) {
    // Your LLM logic here (OpenAI, Anthropic, etc.)
    // Access last action result via context.state.lastActionResult
    const decision = await llm.decide(toolDefinitions, options.input);
    
    if (decision.action) {
      return { action: decision.action, params: decision.params };
    }
    // Return void to stop
  },
});

// Run agent
for await (const event of agent.run({
  action: "brain",
  params: { input: "What's the weather in SF?" },
})) {
  console.log(event);
}
```

## Key Features

- **Automatic Brain Loop**: Actions automatically return to brain after execution
- **State Management**: Access `context.state.lastActionResult` in brain
- **Tool Definitions**: Helper functions to convert actions to LLM tool schemas
- **Framework Agnostic**: Brain can use any LLM or custom logic

## API

- **`defineAgent(config)`** - Create an agent instance
- **`Agent`** - Agent class with `run()` method
- **`getToolDefinitions(actions)`** - Convert actions to tool definitions
- **`convertToolDefinitionsToAISDK(toolDefinitions, toolFn)`** - Convert to AI SDK format

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
