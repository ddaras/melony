## melony

TypeScript‑first, headless React toolkit for building AI chat UIs with streaming support.

[![npm version](https://img.shields.io/npm/v/melony.svg?color=2ea043)](https://www.npmjs.com/package/melony)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/typed-TypeScript-3178c6.svg)

### The core idea

- **MelonyProvider** manages streaming chat state and handles server communication.
- **Hooks** give you fine-grained access to messages, parts, status, and sending.
- **Flexible parts system** supports any message structure with custom mappers.
- **TypeScript-first** with full type safety and extensibility.

### Install

```bash
pnpm add melony 
```

### 30‑second quickstart

Basic chat component with streaming support:

```tsx
"use client";
import {
  MelonyProvider,
  useMelonyMessages,
  useMelonySend,
  useMelonyStatus,
} from "melony";

function ChatMessages() {
  const messages = useMelonyMessages();
  const send = useMelonySend();
  const status = useMelonyStatus();

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}:</strong>
          {message.parts.map((part, i) => (
            <div key={i}>
              {part.type === "text" && part.text}
            </div>
          ))}
        </div>
      ))}
      <button 
        onClick={() => send("Hello!")} 
        disabled={status === "streaming"}
      >
        {status === "streaming" ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default function Chat() {
  return (
    <MelonyProvider endpoint="/api/chat">
      <ChatMessages />
    </MelonyProvider>
  );
}
```

### Text Delta Handling

melony automatically handles text deltas for smooth streaming:

```tsx
// Server streams deltas
data: {"type": "text-delta", "id": "block1", "delta": "Hello"}
data: {"type": "text-delta", "id": "block1", "delta": " world"}
data: {"type": "text-delta", "id": "block1", "delta": "!"}

// Client receives joined text
{type: "text", text: "Hello world!"}
```

Configure delta handling with `useMelonyMessages`:

```tsx
const messages = useMelonyMessages({
  joinTextDeltas: {
    deltaType: "text-delta",
    idField: "id", 
    deltaField: "delta",
    outputType: "text",
    outputField: "text"
  }
});
```

### Custom Message Types

melony supports custom message structures through TypeScript generics and mappers:

```tsx
// Define your custom part type
type CustomPart = {
  melonyId: string;
  type: "text" | "image" | "tool_call";
  role: "user" | "assistant" | "system";
  text?: string;
  imageUrl?: string;
  toolName?: string;
  toolArgs?: Record<string, any>;
};

// Use with custom mappers
function ChatWithCustomTypes() {
  return (
    <MelonyProvider<CustomPart>
      endpoint="/api/chat"
      mapUserMessage={(message) => ({
        melonyId: crypto.randomUUID(),
        type: "text",
        role: "user",
        text: message,
      })}
      mapIncomingPart={(raw) => {
        // Transform server response to your custom part
        return raw as CustomPart;
      }}
    >
      <ChatMessages />
    </MelonyProvider>
  );
}
```

### Advanced Usage with Hooks

For more control, use individual hooks to build custom UIs:

```tsx
import {
  useMelonyMessages,
  useMelonySend,
  useMelonyStatus,
  useMelonyPart,
} from "melony";

export function AdvancedChat() {
  const messages = useMelonyMessages({
    filter: (part) => part.type === "text",
    joinTextDeltas: true,
    limit: 50,
  });
  const send = useMelonySend();
  const status = useMelonyStatus();

  // Listen to individual parts as they stream
  useMelonyPart((part) => {
    console.log("New part received:", part);
  });

  return (
    <div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.parts.map((part, i) => (
              <div key={i}>
                {part.type === "text" && part.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="input">
        <button 
          onClick={() => send("Hello!")} 
          disabled={status === "streaming"}
        >
          {status === "streaming" ? "Sending..." : "Send"}
        </button>
        {status === "error" && <p>Error occurred. Please try again.</p>}
      </div>
    </div>
  );
}
```

### API

#### MelonyProvider

The main provider component that manages chat state and handles server communication.

```tsx
<MelonyProvider<TPart>
  endpoint?: string
  headers?: Record<string, string>
  mapUserMessage?: (message: string) => TPart
  mapIncomingPart?: (raw: unknown) => TPart
>
  {children}
</MelonyProvider>
```

**Props:**
- `endpoint`: API endpoint for chat requests (default: `/api/chat`)
- `headers`: Additional headers to send with requests
- `mapUserMessage`: Transform user input strings into your part type
- `mapIncomingPart`: Transform server responses into your part type

#### Hooks

- **`useMelonyMessages(options?)`** → `MelonyMessage<TPart>[]`
  - Returns grouped and processed messages
  - Options: `filter`, `groupBy`, `sortBy`, `limit`, `joinTextDeltas`

- **`useMelonySend()`** → `(message: string) => Promise<void>`
  - Send a new message to the chat

- **`useMelonyStatus()`** → `"idle" | "requested" | "streaming" | "error"`
  - Current conversation state

- **`useMelonyPart(callback)`** → `void`
  - Subscribe to individual parts as they stream in

#### Types

- **`MelonyPart<TType, TExtra>`**: Base part structure with `melonyId`, `type`, `role`
- **`MelonyMessage<TPart>`**: Message container with `id`, `role`, `parts[]`, `createdAt`, `metadata`
- **`Role`**: `"user" | "assistant" | "system"`

### Server Integration

Your server should accept POST requests and return Server-Sent Events:

```ts
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message } = await req.json();

  // Your AI/LLM logic here
  const response = await callYourAI(message);

  // Return streaming response
  return new Response(response, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

The server should stream JSON objects that match your part structure:

```
data: {"type": "text", "text": "Hello"}
data: {"type": "text", "text": " world"}
data: [DONE]
```

### Requirements

- React `>= 18`
- A server route that returns `text/event-stream`

### License

MIT © melony contributors
