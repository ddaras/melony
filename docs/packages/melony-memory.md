# @melony/memory

## Purpose

`@melony/memory` is the memory and persistence plugin surface.

## Main Exports

- `memory(options)` plugin
- `MemoryOptions`

## Current Contracts

Options:

- `type`: `"memory" | "sqlite" | "redis"`
- `namespace?`: optional scope key

Events:

- listens for `memory:save`
- emits `memory:saved`

## Good For

- Central place to plug in persistence.
- Future integration for conversation history and long-term memory.

## Current Status

This package is currently a lightweight skeleton and intentionally minimal.

## Next Documentation Additions

- Memory adapter interface.
- Read/write lifecycle hooks.
- Serialization and resume strategy.
