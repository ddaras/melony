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

## API Reference

### `memory(options)`

Provides a memory plugin surface for persistence-oriented workflows.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `type`<span class="required-asterisk">*</span> | - | Backend type: `"memory" \| "sqlite" \| "redis"`. |
| `namespace` | - | Namespace key for scoping stored data. |

**Events**

- `memory:save`: listening for this event to trigger a save.
- `memory:saved`: emitted when data is successfully persisted.

## Notes

This package is intentionally minimal right now and acts as a skeleton for richer adapters.

## Types & Interfaces

- `MemoryOptions`
