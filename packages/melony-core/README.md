# @melony/core

Core types and utilities for the Melony framework.

## Overview

This package provides the foundational types and utilities used across all Melony packages:

- **Types**: `MelonyEvent`, `Action`, `Runtime`, `RuntimeContext`, `NextAction`
- **Utilities**: `generateId()` - UUID generator

## Types

### MelonyEvent
Base event type emitted by the runtime.

### Action
Async generator function that yields events and optionally returns a `NextAction` to chain.

### Runtime
Interface for executing actions and streaming events.

### RuntimeContext
Execution context passed to actions, containing state, runId, stepCount, and available actions.

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
