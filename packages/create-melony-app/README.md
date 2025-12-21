# create-melony-app

Create a new Melony app with one command.

## Usage

```bash
npx create-melony-app
# or
pnpm create melony-app
# or
yarn create melony-app
```

The CLI will prompt you for:
- Project name
- Template (Next.js, Vite + React, or Hono)
- Package manager (pnpm, npm, or yarn)

## Templates

### Next.js
A full-stack Next.js application with App Router, including:
- Melony agent setup
- API route for chat
- React components with `@melony/react`
- Tailwind CSS styling

### Vite + React
A frontend-only Vite + React application:
- React components with `@melony/react`
- Tailwind CSS styling
- Theme provider and toggle
- Ready to connect to a backend

### Hono
A backend-only Hono server:
- Melony agent setup
- REST API endpoint
- CORS enabled
- Example actions and brain

## Development

To work on this package locally:

```bash
cd packages/create-melony-app
pnpm install
pnpm build
```

## Publishing

This package should be published to npm so users can run `npx create-melony-app`.

