# Melony Landing

Minimal Vite + React marketing site for Melony.

## Local development

From the repo root:

```bash
pnpm --filter @melony/app-landing dev
```

## Build

```bash
pnpm --filter @melony/app-landing build
```

## Deploy on Vercel

1. Import this monorepo into Vercel.
2. Set the project root directory to `apps/landing`.
3. Install command: `pnpm install`.
4. Build command: `pnpm build`.
5. Output directory: `dist`.

`vercel.json` is included for a minimal Vite deployment config.
