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

## API Reference

### `createOpenAIProvider(options)`

Provides an OpenAI Chat Completions adapter for the Melony LLM plugin.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `apiKey` | `OPENAI_API_KEY` | OpenAI API key. |
| `model` | `gpt-4o-mini` | The OpenAI model name to use. |
| `baseUrl` | Official v1 | The base URL for OpenAI API. |
| `fetchImpl` | - | Custom fetch implementation. |

**Events**

This provider emits standard `@melony/llm` events:

- `text:delta`: streamed text chunks.
- `text:done`: final accumulated text.
- `tool:call`: requested tool executions.
- `done`: end of response stream.
- `error`: provider-specific execution errors.

## Types & Interfaces

- `OpenAIProviderOptions`
