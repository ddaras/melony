# @melony/agents

## Purpose

`@melony/agents` is the high-level API for defining and running Melony agents.

`agent()` is a thin convenience wrapper around `melony()`: it pre-wires agent conventions and events so you can start quickly without manually assembling the runtime builder.

## Install

```bash
pnpm add @melony/agents
```

## Example

```ts
import { agent } from "@melony/agents";

const assistant = agent({
  name: "Support",
  description: "Helps users with account issues",
  instructions: "Be concise and provide step-by-step help."
});

for await (const event of assistant.run({ message: "How do I reset my password?" })) {
  console.log(event.type, event.data);
}
```

## API Reference

### `agent(config)`

The primary function for creating a new Melony agent.
Internally, this composes the same core runtime from `melony()` with agent-focused defaults.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `name`<span class="required-asterisk">*</span> | - | The agent's name. |
| `description` | - | A human-readable description of the agent. |
| `instructions` | - | Instructions for the agent (string or async function). |

**Events**

- `agent:run`: emitted when a run starts.
- `agent:complete`: emitted when a run finishes.

## Types & Interfaces

- `AgentBuilder`
- `AgentEvents`
- `AgentConfig`
- `AgentState`
- `AgentPlugin`
