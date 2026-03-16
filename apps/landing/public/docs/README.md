# Melony Documentation

Melony is an event-native TypeScript runtime for building AI systems with explicit control over execution.

At the core is `melony`: a small, typed runtime where an event enters the system, matching handlers run, and new events can be emitted as output. On top of that runtime, **Melony Harness** provides higher-level packages for common agent concerns such as LLM access, tools, planning, workflows, memory, and React integration.

This split is the key to understanding the project:

- Use **Melony Runtime** when you want a minimal, composable execution model.
- Use **Melony Harness** when you want production-ready agent building blocks on top of that model.

## What makes Melony different

- **Explicit execution**: behavior lives in handlers and emitted events, not hidden framework loops.
- **Observable by design**: the runtime streams events as execution happens, which makes debugging and UI integration straightforward.
- **Incremental adoption**: start with the runtime, then add only the packages you need.
- **Type-safe composition**: state, events, and handlers stay strongly typed end to end.

## Start here

- Read the [Quick Start](/docs/getting-started) to build a minimal runtime in a few minutes.
- Read [Melony Runtime](/docs/concepts/runtime) to understand the execution model.
- Read [Melony Harness](/docs/concepts/harness) to understand how the package ecosystem fits together.
