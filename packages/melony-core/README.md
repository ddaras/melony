# @melony/core

Core types and utilities for the Melony framework.

## Overview

This package provides the foundational types and utilities used across all Melony packages:

- **Types**: `MelonyEvent`, `Action`, `Runtime`, `RuntimeContext`, `NextAction`
- **Message Parsing**: `parseIncomingMessage()` - Parse user messages and approval resumptions
- **HITL Support**: `PendingActionsStore`, `InMemoryPendingActionsStore` - Human-in-the-Loop approval flow
- **UI Protocol**: `UINode`, `UIRoot` - Server-Driven UI types
- **Utilities**: `generateId()` - UUID generator

## Types

### MelonyEvent
Base event type emitted by the runtime. Can include `ui` property for Server-Driven UI.

### Action
Async generator function that yields events and optionally returns a `NextAction` to chain. Supports `requiresApproval` for HITL flows.

### Runtime
Interface for executing actions and streaming events.

### RuntimeContext
Execution context passed to actions, containing state, runId, stepCount, and available actions.

### PendingActionsStore
Interface for managing pending actions that require user approval. Implement this for custom storage (Redis, database, etc.).

### InMemoryPendingActionsStore
In-memory implementation suitable for development and single-server deployments.

## Message Parsing

```typescript
import { parseIncomingMessage } from "@melony/core";

const parsed = parseIncomingMessage(message);

if (parsed.type === "user") {
  console.log(parsed.userText);
} else if (parsed.type === "approval") {
  console.log(parsed.approvalData.pendingActionId);
}
```

## UI Protocol

Server-Driven UI types for rendering UI from server events:

```typescript
import { UINode, UIRoot } from "@melony/core";

const ui: UIRoot = {
  type: "card",
  props: { title: "Weather" },
  children: [
    { type: "text", props: { value: "72°F" } }
  ]
};
```

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
