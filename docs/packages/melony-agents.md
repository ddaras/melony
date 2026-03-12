# @melony/agents

## Purpose

`@melony/agents` is the high-level authoring layer for Melony agents.

It wraps core runtime concepts into a friendlier API.

## Main Exports

- `agent(config)`
- `AgentBuilder`
- `AgentEvents`
- agent-related types (`AgentConfig`, `AgentState`, `AgentPlugin`)

## Current Contracts

- Agent lifecycle events:
  - `agent:run`
  - `agent:complete`
- Agent identity is injected into `state.agent`:
  - `name`
  - `description?`
  - `instructions?`

## Good For

- Defining a single agent with composable plugins.
- Standardizing lifecycle boundaries across capabilities.

## Next Documentation Additions

- Agent state schema recommendations.
- Plugin ordering best practices.
- Multi-agent composition examples.
