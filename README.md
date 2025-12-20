# Melony 🍈

The universal AI agent framework for building apps with cloud support and universal FE.

## Workspace Structure

- `packages/melony`: The core engine, client, and adapters.
- `packages/melony-react`: React components and hooks.
- `apps/agent`: Example agent backend using Hono.
- `apps/vite-app`: Example frontend using Vite and React.

## Getting Started

Check out the [packages/melony/README.md](./packages/melony/README.md) for core usage and [packages/melony-react/README.md](./packages/melony-react/README.md) for React integration.

## Refactor Summary

We recently refactored Melony from a multi-package architecture to a simplified two-package model:
1.  **`melony`**: Unified everything (Core, Runtime, Agents, Client).
2.  **`@melony/react`**: High-level UI components.

This brings:
- **Zero-config setup**: Start with `melony()` and `createClient()`.
- **SDUI Helpers**: Use `ui.card()`, `ui.text()` to push UI from backend.
- **Built-in Adapters**: Native support for Hono and other frameworks.
