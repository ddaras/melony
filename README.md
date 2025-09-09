## melony

TypeScript‑first, headless React toolkit for building AI chat/agent frontends.

[![npm version](https://img.shields.io/npm/v/melony.svg?color=2ea043)](https://www.npmjs.com/package/melony)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typed-TypeScript-3178c6.svg)

### Why melony?

- **Headless-first**: Bring your own styles, or use the included composable UI.
- **Streaming built-in**: First-class SSE streaming with the [AI SDK](https://sdk.vercel.ai/).
- **Tool-usage UI**: Drop-in parts for thinking, tools, and responses.
- **React 18+**: Providers and hooks that feel natural in modern React apps.

### Install

```bash
npm i melony
# or
pnpm add melony
# or
yarn add melony
```

### Quickstart

Client-side usage (e.g. Next.js Client Component):

```tsx
import {
  Conversation,
  MessageList,
  MessageInput,
  ConversationProvider,
  AISDKAdapter,
} from "melony";

const adapter = new AISDKAdapter({
  endpoint: "/api/ai", // Your AI SDK route returning text/event-stream
  debug: false,
});

export default function Chat() {
  return (
    <ConversationProvider adapter={adapter}>
      <Conversation>
        <MessageList />
        <MessageInput />
      </Conversation>
    </ConversationProvider>
  );
}
```

Minimal server route using the AI SDK (Edge/Next.js):

```ts
// app/api/ai/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = await req.json();
  const userText = message?.parts?.[0]?.text ?? "";

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: userText }],
  });

  // Returns an SSE stream compatible with melony's AISDKAdapter
  return result.toDataStreamResponse();
}
```

### What’s included

- **Components**: `Conversation`, `MessageList`, `MessageItem`, `MessageInput`, `ToolResponse`, `Thinking`, `AgentSidebar`, `Flow`
- **Hooks**: `useConversation`, `useMessages`, `useFlow`, `useAgent`
- **Providers**: `ConversationProvider`, `FlowProvider`
- **Adapters**: `AISDKAdapter` (SSE streaming). WebSocket support coming next.

### Adapter options

- **endpoint**: string – your server route that accepts `POST` and returns SSE
- **headers**: Record<string, string> – optional extra headers
- **debug**: boolean – verbose logs for development

### Requirements

- React `>= 18`
- A server route powered by the [AI SDK](https://sdk.vercel.ai/) that returns `text/event-stream`

### Scripts

- **build**: `npm run build`
- **dev (watch)**: `npm run dev`
- **typecheck**: `npm run typecheck`
- **clean**: `npm run clean`

### Roadmap

- WebSocket adapter
- More provider patterns and first-class multi-agent flows
- Additional starters/examples

### License

MIT © melony contributors
