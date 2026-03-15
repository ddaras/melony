# @melony/gemini

## Purpose

`@melony/gemini` provides a Google Gemini adapter for the Melony LLM plugin.

## Install

```bash
pnpm add @melony/gemini
```

## Example

```ts
import { agent } from "@melony/agents";
import { llm } from "@melony/llm";
import { createGeminiProvider } from "@melony/gemini";

const provider = createGeminiProvider({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash"
});

const assistant = agent("Assistant").use(llm({ provider }));
```

## Main Exports

- `createGeminiProvider(options)`
- `GeminiProviderOptions`

## Options

- `apiKey`: Gemini API key. Falls back to `GEMINI_API_KEY` or `GOOGLE_API_KEY` env vars.
- `model`: model name to use. Defaults to `gemini-2.0-flash`.
- `baseUrl`: Gemini base URL. Defaults to the official v1beta endpoint.
- `fetchImpl`: optional custom fetch implementation.

## Events

This provider emits standard `@melony/llm` events:

- `text:delta`: streamed text chunks.
- `text:done`: final accumulated text.
- `tool:call`: requested tool executions.
- `done`: end of response stream.
- `error`: provider-specific execution errors.
