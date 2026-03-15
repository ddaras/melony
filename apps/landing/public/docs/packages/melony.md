# melony

## Purpose

`melony` is the core, unopinionated event runtime.

It provides:

- event processing
- interceptors
- event handlers
- runtime execution and streaming helpers

## Main Exports

- `melony()` factory
- `MelonyBuilder`
- `Runtime`
- core types (`Event`, `RuntimeContext`, etc.)

## Current Contracts

- Event shape: `{ type, data, id? }`
- Interceptors run before handlers.
- Handlers can yield events, and yielded events are recursively processed.
- Runtime emits an `error` event for thrown non-event errors.

## Good For

- Building custom event-driven agents.
- Reusable plugin systems.
- Framework-level agent orchestration.

## Next Documentation Additions

- A minimal plugin authoring guide.
- Error-handling and suspend patterns.
- Event naming conventions.
