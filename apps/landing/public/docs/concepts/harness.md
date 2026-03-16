# Melony Harness

Melony Harness is the package ecosystem built on top of the Melony Runtime.

If the runtime is the execution engine, the harness is the set of reusable building blocks for agent systems. It gives you higher-level primitives without hiding the underlying event model.

## The role of the harness

The runtime answers:

- How does execution flow?
- How are events processed?
- How is run state managed?

The harness answers:

- How do I model an agent?
- How do I connect LLMs and providers?
- How do I expose tools and actions?
- How do I add planning, workflows, memory, and UI bindings?

This separation keeps the foundation minimal and the ecosystem composable.

## What is included

Melony Harness is composed of focused packages:

- [`@melony/agents`](/docs/packages/melony-agents) for agent-oriented primitives
- [`@melony/llm`](/docs/packages/melony-llm) for model abstraction
- [`@melony/openai`](/docs/packages/melony-openai) and [`@melony/gemini`](/docs/packages/melony-gemini) for providers
- [`@melony/actions`](/docs/packages/melony-actions) for tools and side-effectful actions
- [`@melony/planning`](/docs/packages/melony-planning) for planner-driven loops
- [`@melony/workflows`](/docs/packages/melony-workflows) for orchestration patterns
- [`@melony/memory`](/docs/packages/melony-memory) for stateful memory layers
- [`@melony/react`](/docs/packages/melony-react) for React integration

Each package extends the runtime through events, handlers, plugins, or thin integration layers.

## Runtime vs harness

Use **Melony Runtime** when:

- you want full control over your event schema
- you are building a custom execution model
- you want the smallest possible foundation

Use **Melony Harness** when:

- you want agent building blocks that already fit the Melony execution model
- you want to compose common capabilities instead of designing them from scratch
- you want faster progress without giving up observability

In practice, most teams use both: the runtime as the foundation, and selected harness packages on top.

## Design principle

The harness is intentionally additive, not magical.

It does not replace the runtime with a separate abstraction. Instead, it packages common agent behaviors in forms that remain visible and debuggable. That means you can start simple, adopt packages one by one, and still understand the exact execution path when something goes wrong.

## Practical mental model

Think of the relationship like this:

- **Melony Runtime** is the kernel
- **Melony Harness** is the agent toolkit built on top of that kernel

You can build directly on the kernel, but the toolkit helps you move faster once you need agent-specific capabilities.
