# @melony/client

Framework-agnostic client for Melony. Provides runtime communication and event streaming for any UI framework.

## Installation

```bash
npm install @melony/client
```

## Overview

Provides the core client functionality for building Melony applications:

- **Runtime Client**: Client for streaming events from the Melony runtime
- **Transport Layer**: HTTP and custom transport implementations for runtime communication
- **State Management**: Built-in state management with subscription support

## Usage

### Basic Usage

```typescript
import { MelonyRuntimeClient, createHttpTransport } from "@melony/client";

const client = new MelonyRuntimeClient({
  api: "/api/chat", // or use custom transport
});

// Subscribe to state changes
const unsubscribe = client.subscribe((state) => {
  console.log("State updated:", state);
});

// Send a message and stream events
for await (const event of client.sendMessage({
  role: "user",
  content: [{ type: "text", data: { content: "Hello" } }],
})) {
  console.log("Received event:", event);
}

// Get current state
const state = client.getState();
console.log("Current events:", state.events);
console.log("Current messages:", state.messages);
console.log("Thread ID:", state.threadId);

// Clean up
unsubscribe();
```

### Custom Transport

```typescript
import { MelonyRuntimeClient, TransportFn } from "@melony/client";

const customTransport: TransportFn = async (request, signal) => {
  // Your custom transport implementation
  const response = await fetch("/custom-api", {
    method: "POST",
    body: JSON.stringify({
      message: request.message,
      threadId: request.threadId,
    }),
    signal,
  });
  return response.body!;
};

const client = new MelonyRuntimeClient({
  transport: customTransport,
});
```

### Thread Management

```typescript
// Create client with existing thread
const client = new MelonyRuntimeClient({
  api: "/api/chat",
  threadId: "existing-thread-id",
});

// Clear state and start new thread
client.clear(); // Generates new threadId
```

## API

### `MelonyRuntimeClient`

Main client class for runtime communication.

**Constructor Options:**
- `transport?: TransportFn` - Custom transport function (or use `api`)
- `api?: string` - API endpoint URL (creates HTTP transport)
- `threadId?: string` - Optional thread ID (auto-generated if not provided)

**Methods:**
- `sendMessage(message: ChatMessage): AsyncGenerator<MelonyEvent>` - Send message and stream events
- `subscribe(listener: (state: MelonyRuntimeClientState) => void): () => void` - Subscribe to state changes
- `getState(): MelonyRuntimeClientState` - Get current state
- `clear(): void` - Clear all events and reset state

### `createHttpTransport(api: string): TransportFn`

Create an HTTP transport function for the runtime client.

### Types

- `ChatMessage` - Chat message format with role and content
- `TransportRequest` - Transport request payload
- `TransportFn` - Transport function type
- `MelonyRuntimeClientOptions` - Client constructor options
- `MelonyRuntimeClientState` - Client state interface

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
