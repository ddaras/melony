# @melony/openai

## Purpose

`@melony/openai` provides an OpenAI Chat Completions adapter for the Melony LLM plugin.

## Install

```bash
pnpm add @melony/openai
```

## Example

```ts
import { agent } from "@melony/agents";
import { llm } from "@melony/llm";
import { createOpenAIProvider } from "@melony/openai";

const provider = createOpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini"
});

const assistant = agent("Assistant").use(llm({ provider }));
```

## Main Exports

- `createOpenAIProvider(options)`
- `OpenAIProviderOptions`

## Options

- `apiKey`: OpenAI API key. Falls back to `OPENAI_API_KEY` env var.
- `model`: model name to use. Defaults to `gpt-4o-mini`.
- `baseUrl`: OpenAI base URL. Defaults to the official v1 endpoint.
- `fetchImpl`: optional custom fetch implementation.

## Events

This provider emits standard `@melony/llm` events:

- `text:delta`: streamed text chunks.
- `text:done`: final accumulated text.
- `tool:call`: requested tool executions.
- `done`: end of response stream.
- `error`: provider-specific execution errors.
