## melony (work-in-progress)

TypeScript-first, headless React toolkit for building AI chat/agent frontends.

Currently supports the AI SDK backend over HTTP only (no WS/SSE streaming yet).

### Install

```bash
pnpm add melony
```

### Usage (quick peek)

```tsx
import {
  Conversation,
  MessageList,
  MessageInput,
  ConversationProvider,
  DefaultAIClient,
} from "melony";

// AI SDK backend (HTTP only)
const client = new DefaultAIClient({
  endpoint: "/api/ai", // Your AI SDK route that accepts POST and returns a Message
});

function Chat() {
  return (
    <ConversationProvider client={client}>
      <Conversation>
        <MessageList />
        <MessageInput />
      </Conversation>
    </ConversationProvider>
  );
}
```

### Development

- Build: `npm run build`
- Dev (watch): `npm run dev`
- Typecheck: `npm run typecheck`
- Clean: `npm run clean`

### Publishing

This package is configured with ESM + CJS outputs and types. To publish:

```bash
npm version patch # or minor/major
npm publish --access public
```
