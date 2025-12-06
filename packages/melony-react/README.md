# @melony/react

React components and hooks for building AI chat interfaces with Melony.

## Installation

```bash
npm install @melony/react
```

## Quick Start

```tsx
import { MelonyProvider, Chat } from "@melony/react";

function App() {
  return (
    <MelonyProvider widgets={[/* your widgets */]}>
      <Chat api="/api/chat" />
    </MelonyProvider>
  );
}
```

## Core Components

- **`MelonyProvider`** - Context provider for widgets, theme, and event handling
- **`Chat`** - Complete chat interface with message history and input
- **`Response`** - Render AI responses with widget support
- **`Widget`** - Render individual widgets

## Hooks

- **`useMelonyChat`** - Chat functionality (messages, send, loading)
- **`useMelonyRuntime`** - Runtime integration with event streaming
- **`useMelonyThreads`** - Thread/conversation management
- **`useMelony`** - Access widget registry and dispatch events
- **`useDispatchedEvent`** - Listen to dispatched events

## UI Components

Layout: `Row`, `Col`, `Box`, `Spacer`, `Divider`, `List`  
Content: `Text`, `Heading`, `Image`, `Icon`, `Badge`, `Chart`  
Forms: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Form`, `Label`  
Containers: `Card`

## Development

```bash
pnpm build      # Build
pnpm dev        # Watch mode
pnpm typecheck  # Type check
pnpm clean      # Clean dist
```
