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

## API Reference

### `createGeminiProvider(options)`

Provides a Google Gemini adapter for the Melony LLM plugin.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `apiKey` | `GEMINI_API_KEY` | Gemini API key. Also checks `GOOGLE_API_KEY`. |
| `model` | `gemini-2.0-flash` | The Gemini model name to use. |
| `baseUrl` | Official v1beta | The base URL for Gemini API. |
| `fetchImpl` | - | Custom fetch implementation. |

**Events**

This provider emits standard `@melony/llm` events:

- `text:delta`: streamed text chunks.
- `text:done`: final accumulated text.
- `tool:call`: requested tool executions.
- `done`: end of response stream.
- `error`: provider-specific execution errors.

## Types & Interfaces

- `GeminiProviderOptions`
