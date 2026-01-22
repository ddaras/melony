# Introduction

Melony is a **fast, unopinionated, minimalist event-based framework** for building AI agents.

Melony is designed to be the "Express.js" of the agent world. It doesn't force a specific LLM, orchestration pattern, or UI library on you. Instead, it provides a tiny, high-performance core for routing events and executing actions.

## Why Melony?

- **Fast & Lightweight**: Zero dependencies at its core. A tiny footprint for any JS environment.
- **Unopinionated**: No rigid orchestration loops. You define how events flow through handlers.
- **Event-Driven**: Everything in Melony is an event. Text, tool results, and custom data all flow through a unified stream.
- **Highly Extensible**: Modularize your logic with the **Plugin System**, or use event handlers to intercept runs, manage state, or implement HITL workflows.
- **Platform Agnostic**: Run your Melony agents anywhere—Edge functions, Node.js, or directly in the browser.
- **UI-Ready**: While unopinionated about UI, Melony's event stream is perfect for building Server-Driven UI (SDUI) experiences.

## Core Philosophy

Melony treats the interaction between a user and an agent as a continuous, reactive stream of events. 

Instead of a rigid Request/Response model or a fixed "Plan -> Execute -> Observe" loop, Melony provides a **fluent builder** to wire up actions and event handlers. Your logic can yield events that trigger other handlers, creating complex behaviors from simple, decoupled pieces.

## What's Included?

1. **`melony`**: The core runtime and fluent builder.
2. **`@melony/react`**: React hooks and components to render Melony streams and SDUI nodes effortlessly.

Ready to build? [Head over to the Getting Started guide](./getting-started.md).
