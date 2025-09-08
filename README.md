## melony (work-in-progress)

TypeScript-first, headless React toolkit for building AI chat/agent frontends.

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
} from "melony";

function Chat() {
  return (
    <ConversationProvider>
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
