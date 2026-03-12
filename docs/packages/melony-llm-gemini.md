# @melony/llm-gemini

## Purpose

`@melony/llm-gemini` provides a Google Gemini adapter for `@melony/llm`.

## Main Exports

- `createGeminiProvider(options)`
- `GeminiProviderOptions`

## Usage

```ts
import { llm } from "@melony/llm";
import { createGeminiProvider } from "@melony/llm-gemini";

const provider = createGeminiProvider({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.0-flash"
});

agentBuilder.use(llm({ provider }));
```

## Options

- `apiKey`: Gemini API key. Falls back to `process.env.GEMINI_API_KEY` and `process.env.GOOGLE_API_KEY`.
- `model`: Model name. Defaults to `gemini-2.0-flash`.
- `baseUrl`: Gemini base URL. Defaults to `https://generativelanguage.googleapis.com/v1beta`.
- `fetchImpl`: Optional custom fetch implementation.

## Events Emitted

Provider emits `@melony/llm` provider events:

- `text:delta`
- `text:done`
- `tool:call`
- `done`
- `error`
