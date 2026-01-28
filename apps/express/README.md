# Melony Express Demo

This simple Express server shows how to host a Melony agent with Server-Sent Events (SSE) so any client can stream events in real time.

## Getting started

```bash
cd apps/express
pnpm install
pnpm --filter melony-express dev
```

## Available scripts

- `pnpm --filter melony-express dev` — run the server with `tsx` in watch mode.
- `pnpm --filter melony-express build` — compile TypeScript into `dist/`.
- `pnpm --filter melony-express start` — run the compiled server with Node.

## Endpoints

- `GET /` — health metadata (JSON with server info).
- `POST /api/chat` — stream Melony events. Send JSON like:

```json
{
  "event": {
    "type": "user:text",
    "data": {
      "content": "Hello"
    }
  }
}
```

Use `curl` (with `-N` to keep the stream open) to try it:

```bash
curl -N \
  -H "Content-Type: application/json" \
  -d '{"event":{"type":"user:text","data":{"content":"Hello from curl"}}}' \
  http://localhost:4001/api/chat
```

Endpoints stream SSE-formatted events (`data: {...}`), so you can hook them up to any UI client that supports SSE or the official `@melony/react` client.
