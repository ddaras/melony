# @melony/runtime

Runtime engine for executing actions in the Melony framework.

## Overview

The runtime executes actions as async generators, allowing actions to yield events and chain to other actions. It manages execution context, state, and provides safety limits.

## Usage

```typescript
import { defineRuntime, defineAction } from "@melony/runtime";
import z from "zod";

// Define actions
const myAction = defineAction({
  name: "myAction",
  paramsSchema: z.object({ input: z.string() }),
  execute: async function* (params, context) {
    yield { type: "message", data: { content: params.input } };
    // Chain to another action
    return { action: "nextAction", params: {} };
  },
});

// Create runtime
const runtime = defineRuntime({
  actions: { myAction },
  safetyMaxSteps: 10,
});

// Run
for await (const event of runtime.run({
  start: { action: "myAction", params: { input: "Hello" } },
})) {
  console.log(event);
}
```

## API

- `defineRuntime(config)` - Create a runtime instance
- `defineAction(action)` - Define an action with Zod schema validation
- `createStreamResponse(generator)` - Convert event generator to HTTP SSE stream

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
