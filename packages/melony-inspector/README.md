# @melony/inspector

The real-time inspection plugin for Melony agents.

## Installation

```bash
npm install @melony/inspector
```

## Usage

```typescript
import { agent } from "@melony/agents";
import { inspector } from "@melony/inspector";

const myAgent = agent("my-agent")
  .use(inspector({
    url: "http://localhost:7123" // Optional: default studio URL
  }))
  .use(llm(...));
```

## Features

- **Captures Events**: Every event emitted by the agent is sent to Melony Studio.
- **State Snapshots**: Captures the full `context.state` at the time of each event.
- **Minimal Performance Impact**: Uses fire-and-forget `fetch` to avoid blocking agent execution.
