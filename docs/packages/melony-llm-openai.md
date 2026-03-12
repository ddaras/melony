# @melony/llm-openai

## Purpose

`@melony/llm-openai` provides an OpenAI Chat Completions adapter for `@melony/llm`.

## Main Exports

- `createOpenAIProvider(options)`
- `OpenAIProviderOptions`

## Usage

```ts
import { llm } from "@melony/llm";
import { createOpenAIProvider } from "@melony/llm-openai";

const provider = createOpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini"
});

agentBuilder.use(llm({ provider }));
```

## Options

- `apiKey`: OpenAI API key. Falls back to `process.env.OPENAI_API_KEY`.
- `model`: Model name. Defaults to `gpt-4o-mini`.
- `baseUrl`: OpenAI base URL. Defaults to `https://api.openai.com/v1`.
- `fetchImpl`: Optional custom fetch implementation.

## Events Emitted

Provider emits `@melony/llm` provider events:

- `text:delta`
- `text:done`
- `tool:call`
- `done`
- `error`
