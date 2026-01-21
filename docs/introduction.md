# Introduction

Melony is a small **event-streaming runtime** designed for building modern AI agents with first-class **Server-Driven UI (SDUI)**.

In the world of AI agents, streaming text is no longer enough. Users expect rich, interactive interfaces that respond to agent actions in real-time. Melony provides the infrastructure to bridge the gap between your agent's logic and a rich frontend experience.

## Why Melony?

- **Minimalist & Typed**: A small core footprint with full TypeScript support and Zod integration for robust action schemas.
- **First-class SDUI**: Define your UI on the server using a typed builder and let Melony handle the streaming and rendering.
- **Event-Driven**: Everything in Melony is an event. Text, UI, tool results, and custom data all flow through a unified stream.
- **Pluggable Orchestration**: Use hooks to intercept runs, manage state, add logging, or implement Human-in-the-Loop (HITL) workflows.
- **Platform Agnostic**: Run your Melony agents on any JS environment—Edge functions, Node.js, or even directly in the browser.

## Core Philosophy

Melony treats the interaction between a user and an agent as a continuous stream of events. 

Instead of a simple Request/Response model, Melony uses **Async Generators**. Your agent logic (Actions) can yield multiple events over time—streaming a thought, then a UI card, then a tool result, and finally more text—all within a single execution context.

## What's Included?

1. **`melony`**: The core runtime and SDUI builder.
2. **`@melony/react`**: A set of React hooks and components to render Melony streams and SDUI nodes effortlessly.

Ready to build? [Head over to the Getting Started guide](./getting-started.md).
