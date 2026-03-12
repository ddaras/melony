# Melony Studio

Real-time inspection and observability for Melony agents.

## Getting Started

1. Start the Studio server:
   ```bash
   cd apps/studio
   npm run server
   ```

2. Start the Studio UI:
   ```bash
   cd apps/studio
   npm run dev
   ```

3. In your Melony agent project, use the inspector:
   ```typescript
   import { agent } from "@melony/agents";
   import { inspector } from "@melony/inspector";

   const myAgent = agent("my-agent")
     .use(inspector())
     .use(llm(...));
   ```

## Architecture

- **`@melony/inspector`**: A plugin for Melony agents that captures events and state changes.
- **Studio Server**: A Node.js relay server that receives events via POST and broadcasts them via WebSockets.
- **Studio UI**: A React dashboard to visualize the agent's timeline and state.
