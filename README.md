## melony

TypeScript‑first, headless React toolkit for building AI chat UIs.

[![npm version](https://img.shields.io/npm/v/melony.svg?color=2ea043)](https://www.npmjs.com/package/melony)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typed-TypeScript-3178c6.svg)

### The core idea

- **Agent** gives you streaming chat state.
- **useAgent** lets you read messages and send new ones.
- Optional **components** help you ship a beautiful chat fast.

### Install

```bash
pnpm add melony 
```

### 30‑second quickstart

Client component (e.g. Next.js) with built‑in streaming handler:

```tsx
"use client";
import {
  Agent,
  Conversation,
  Messages,
  UserInput,
} from "melony/react";

export default function Chat() {
  return (
    <Agent options={{ api: "/api/chat", debug: false }}>
      <Conversation.Container>
        <Conversation.Content>
          <Messages />
        </Conversation.Content>
        <Conversation.Footer>
          <UserInput placeholder="Ask me anything…" />
        </Conversation.Footer>
      </Conversation.Container>
    </Agent>
  );
}
```

### AI SDK Integration

For advanced use cases, melony provides a direct adapter for the Vercel AI SDK that gives you more control over the streaming process:

```ts
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createMelonyStreamFromAISDK } from "melony";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: message }],
  });

  // Use the melony adapter for more control
  const stream = createMelonyStreamFromAISDK(result.fullStream, {
    onFinish: ({ message }) => {
      console.log("Streaming finished:", message);
      // Save to database, log, etc.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

The `createMelonyStreamFromAISDK` function:

- Converts AI SDK stream chunks to melony-compatible events
- Supports text streaming, tool calls, and reasoning steps
- Provides `onFinish` callback for post-processing
- Handles error states and cleanup automatically

### Make your own UI with the hook

```tsx
import { useAgent } from "melony/react";

export function MyChat() {
  const { messages, prompt, status } = useAgent();

  return (
    <div>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {m.parts.map((p) => (p.type === "text" ? p.text : ""))}
          </li>
        ))}
      </ul>
      <button onClick={() => prompt("Hello")} disabled={status === "streaming"}>
        {status === "streaming" ? "Sending..." : "Send"}
      </button>
      {status === "error" && <p>Error occurred. Please try again.</p>}
    </div>
  );
}
```

### API

- **Agent**

  - `options`: `{ api: string; headers?: Record<string, string>; debug?: boolean }`
    - `api` is your POST route that returns `text/event-stream`.

- **useAgent() →** `{ messages, prompt, status }`
  - `messages`: array of chat `Message` objects
  - `prompt(message: string)`: send a user message
  - `status`: current conversation state (`"idle"` | `"requested"` | `"streaming"` | `"error"`)

### Components (optional)

- `Conversation.Container`, `Conversation.Content`, `Conversation.Footer`: layout helpers with sticky‑scroll UX.
- `Messages`: renders all messages using `Message`.
- `Message`: renders each message, including text/reasoning/tool parts.
- `UserInput`: controlled input + send button wired to `prompt`.
- `TextPart`: renders markdown text parts.
- `ReasoningPart`: shows “thinking” content.
- `ToolPart`: shows tool call input/progress/result.
- `Thinking`: a lightweight “thinking…” indicator you can place anywhere.

Styling is headless by default. Most components accept `className` props, and `Messages`/`Message` expose `userBubbleClassName`, `assistantBubbleClassName`, and `systemBubbleClassName` for easy theming.

### Requirements

- React `>= 18`
- A server route that returns `text/event-stream` (AI SDK recommended)

### License

MIT © melony contributors
