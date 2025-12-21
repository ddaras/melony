# Melony Hono Server

This is a [Hono](https://hono.dev) server bootstrapped with [create-melony-app](https://github.com/ddaras/melony).

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The server will start on [http://localhost:3000](http://localhost:3000) by default.

## API Endpoints

- `GET /` - Health check
- `GET /health` - Health check
- `POST /api/chat` - Melony chat endpoint

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
```

## Learn More

- [Melony Documentation](https://github.com/ddaras/melony)
- [Hono Documentation](https://hono.dev)

