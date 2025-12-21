# Next.js Example

This is a Next.js example application demonstrating the Melony framework with a weather action.

## Features

- Weather checking action that streams UI components
- Server-Driven UI (SDUI) with weather cards
- Streaming chat interface using `@melony/react`

## Development

```bash
pnpm dev
```

The app will start on `http://localhost:3000` (or the port specified by Next.js).

## How it works

1. **Backend**: The API route at `/app/api/chat/route.ts` handles chat requests using the Melony runtime
2. **Agent**: Defined in `/src/agent.ts` with a weather action and brain
3. **Frontend**: The main page uses `@melony/react` components to render the chat interface

## Try it out

Ask about the weather! For example:
- "What is the weather?"
- "Check the weather in San Francisco"

The agent will respond with a weather card UI component that's streamed from the server.
