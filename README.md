## ai-frontend (work-in-progress)

TypeScript-first, headless React toolkit for building AI chat/agent frontends.

### Install

```bash
npm i ai-frontend
```

### Usage (quick peek)

```tsx
import { Conversation, MessageList, MessageInput, ConversationProvider } from 'ai-frontend';

function Chat() {
  return (
    <ConversationProvider>
      <Conversation>
        <MessageList messages={[]} />
        <MessageInput value={''} onChange={() => {}} onSubmit={() => {}} />
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

