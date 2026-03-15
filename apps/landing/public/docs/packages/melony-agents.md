# @melony/agents

## Purpose

`@melony/agents` is the high-level API for defining and running Melony agents.

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

## Main Exports

- `agent(config)`
- `AgentBuilder`
- `AgentEvents`
- `AgentConfig`
- `AgentState`
- `AgentPlugin`

## Options

- `name`: required agent name.
- `description`: optional human-readable description.
- `instructions`: optional string or async function returning instructions.

## Events

- `agent:run`: emitted when a run starts.
- `agent:complete`: emitted when a run finishes.
