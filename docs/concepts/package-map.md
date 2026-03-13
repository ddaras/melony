# Package Map

This is the current package layout and dependency direction.

## Foundation

- `melony`
  - Core event runtime and builder.
  - Base types: `Event`, `RuntimeContext`, handlers, interceptors.

## Agent Layer

- `@melony/agents`
  - Agent authoring layer on top of `melony`.
  - Defines `AgentBuilder`, identity state, and lifecycle events.

## Capability Plugins

- `@melony/actions`
  - Action/tool registry and execution.
  - Depends on `@melony/agents` and `melony`.

- `@melony/llm`
  - LLM provider abstraction and orchestration plugin.
  - Depends on `@melony/agents` and `melony`.

- `@melony/memory`
  - Memory/persistence plugin surface.
  - Depends on `@melony/agents` and `melony`.

- `@melony/workflows`
  - Multi-agent orchestration patterns (sequential/parallel/loop).
  - Depends on `@melony/agents` and `melony`.

- `@melony/planning`
  - Planning lifecycle primitives (plan creation, step execution, retries, replans).
  - Depends on `@melony/agents` and `melony`.

## UI Layer

- `@melony/react`
  - React hooks/components for Melony apps.
  - Depends on `melony`.

## Design Principle

Each package should stay small and composable:

- one clear responsibility,
- explicit event/state contracts,
- no hidden cross-package coupling.
