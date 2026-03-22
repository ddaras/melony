# create-melony-app

Scaffold a new Melony agent app in seconds.

## Usage

```bash
npx create-melony-app
```

Or with a project name:

```bash
npx create-melony-app my-agent
```

## What's included?

- **Express Server**: A pre-configured server that handles CORS and chat routing.
- **Sample Agent**: A basic agent using OpenAI and Melony primitives.
- **Studio Ready**: A generated link that opens your local agent in [studio.melony.dev](https://studio.melony.dev).

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build the package:
   ```bash
   pnpm build
   ```

3. Run locally:
   ```bash
   node bin/cli.js
   ```
