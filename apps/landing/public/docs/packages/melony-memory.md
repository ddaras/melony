# @melony/memory

## Purpose

`@melony/memory` provides a memory plugin surface for persistence-oriented workflows.

## Install

```bash
pnpm add @melony/memory
```

## Example

```ts
import { agent } from "@melony/agents";
import { memory } from "@melony/memory";

const assistant = agent("Assistant").use(
  memory({
    type: "memory",
    namespace: "support-bot"
  })
);
```

## Main Exports

- `memory(options)`
- `MemoryOptions`

## Options

- `type`: required backend type: `"memory" | "sqlite" | "redis"`.
- `namespace`: optional namespace key for scoping stored data.

## Events

- `memory:save`: listening for this event to trigger a save.
- `memory:saved`: emitted when data is successfully persisted.

## Notes

This package is intentionally minimal right now and acts as a skeleton for richer adapters.
