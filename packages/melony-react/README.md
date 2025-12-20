# @melony/react

React components and hooks for building AI chat interfaces with Melony.

## Installation

```bash
npm install @melony/react
```

## Quick Start

```tsx
import { MelonyStoreProvider, Thread, ThreadSidebar, useMelony } from "@melony/react";

function ThreadApp() {
  const { threads, activeThreadId, messages, isLoading } = useMelony();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ThreadSidebar threads={threads} activeThreadId={activeThreadId} />
      <Thread messages={messages} isLoading={isLoading} />
    </div>
  );
}

export default function App() {
  return (
    <MelonyStoreProvider api="/api/chat">
      <ThreadApp />
    </MelonyStoreProvider>
  );
}
```

## Architecture

Melony React uses an **event-based architecture** where all actions are dispatched as events:

```tsx
const { dispatchEvent } = useMelony();

// Create a thread
dispatchEvent({ type: 'createThread' });

// Switch thread
dispatchEvent({ type: 'switchThread', data: { threadId: 'abc' } });

// Send a message
dispatchEvent({
  type: 'sendMessage',
  data: {
    role: 'user',
    content: [{ type: 'text', data: { content: 'Hello!' } }]
  }
});
```

## Core Components

### `MelonyStoreProvider`

The main provider that manages threads, messages, and API communication.

```tsx
<MelonyStoreProvider
  api="/api/chat"
  onLoadHistory={async (threadId) => {
    // Load message history when switching threads
    const res = await fetch(`/api/threads/${threadId}/messages`);
    return res.json();
  }}
  onThreadsChange={(threads) => {
    // Persist threads (e.g., to localStorage)
    localStorage.setItem('threads', JSON.stringify(threads));
  }}
  onEvent={(event) => {
    // Handle custom events
    console.log('Event:', event.type);
  }}
>
  <App />
</MelonyStoreProvider>
```

### `Thread`

The main thread interface component.

```tsx
<Thread
  messages={messages}
  isLoading={isLoading}
  placeholder="Type a message..."
  components={{
    // Custom components for Server-Driven UI
    'weather-card': WeatherCard,
  }}
/>
```

### `ThreadSidebar`

Sidebar showing list of conversation threads.

```tsx
<ThreadSidebar
  threads={threads}
  activeThreadId={activeThreadId}
  width={280}
/>
```

## Hooks

### `useMelony()`

Main hook to access store state and dispatch events.

```tsx
const {
  // State
  threads,           // Thread[] - all threads
  activeThreadId,    // string | null
  activeThread,      // Thread | undefined
  messages,          // ChatMessage[] - messages in active thread
  isLoading,         // boolean
  error,             // Error | null
  
  // Methods
  dispatchEvent,     // (event: Event) => void
  getThread,         // (id: string) => Thread | undefined
  getThreadMessages, // (id: string) => ChatMessage[]
} = useMelony();
```

### `useDispatchedEvent()`

Listen to events dispatched through the system.

```tsx
useDispatchedEvent((event) => {
  if (event.type === 'sendMessage') {
    console.log('Message sent!');
  }
});
```

## Event Types

| Event | Data | Description |
|-------|------|-------------|
| `createThread` | `{ initialMessage?, title? }` | Create a new thread |
| `switchThread` | `{ threadId }` | Switch to a thread |
| `deleteThread` | `{ threadId }` | Delete a thread |
| `updateThreadTitle` | `{ threadId, title }` | Update thread title |
| `sendMessage` | `{ role, content, threadId? }` | Send a message |
| `clearThread` | `{ threadId? }` | Clear thread messages |

## UI Components

Layout: `Row`, `Col`, `Box`, `Spacer`, `Divider`, `List`, `ListItem`  
Content: `Text`, `Heading`, `Image`, `Icon`, `Badge`, `Chart`  
Forms: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Form`, `Label`  
Containers: `Card`

## Server-Driven UI

Components can render UI from server events:

```tsx
// Server sends:
yield {
  type: 'ui',
  ui: {
    type: 'card',
    props: { title: 'Weather' },
    children: [
      { type: 'text', props: { value: '72°F' } }
    ]
  }
};

// Renderer automatically displays the Card with Text
```

## Theming

```tsx
<MelonyStoreProvider
  api="/api/chat"
  theme={{
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
    },
    radius: {
      md: '8px',
    },
  }}
>
  <App />
</MelonyStoreProvider>
```

## Migration from Legacy Hooks

If you're using the deprecated hooks (`useMelonyRuntime`, `useMelonyThread`, `useMelonyThreads`):

```tsx
// Before:
const { messages, sendMessage } = useMelonyThread({ api: '/api/chat' });
const { threads, createThread } = useMelonyThreads({ threads, activeThreadId });

// After:
// 1. Wrap with MelonyStoreProvider
// 2. Use useMelony()
const { messages, threads, dispatchEvent } = useMelony();

// Send message via event
dispatchEvent({
  type: 'sendMessage',
  data: { role: 'user', content: [...] }
});

// Create thread via event  
dispatchEvent({ type: 'createThread' });
```

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
