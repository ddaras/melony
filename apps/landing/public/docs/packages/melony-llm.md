# @melony/llm

## Purpose

`@melony/llm` connects provider streaming and tool-calling to Melony agent runs.

## Install

```bash
pnpm add @melony/llm
```

## Example

```ts
import { agent } from "@melony/agents";
import { llm } from "@melony/llm";
import { openaiProvider } from "@melony/openai";

const assistant = agent({
  name: "Assistant",
  instructions: "You are concise and helpful."
}).use(
  llm({
    provider: openaiProvider({ model: "gpt-4o-mini" })
  })
);
```

## API Reference

### `llm(options)`

The primary plugin for connecting LLM providers to Melony agents.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `provider`<span class="required-asterisk">*</span> | - | The LLM provider implementation. |
| `temperature` | - | Sampling temperature for the model. |
| `maxOutputTokens` | - | Maximum number of tokens to generate. |
| `maxSteps` | `6` | Maximum model-tool loop iterations per run. |
| `messageSelector` | `state.messages` | Function to read message history from state. |
| `toolSelector` | `state.actions` | Function to read available tools from state. |

**Events**

- `llm:text:delta`: streamed text chunks from the provider.
- `llm:text`: completed text output for a generation pass.
- `llm:error`: provider-level error event.

## Provider Contract

- Implement `generate(args): AsyncGenerator<LlmProviderEvent>`.
- Supported provider event types: `text:delta`, `text:done`, `tool:call`, `done`, `error`.

## Good For

- Streaming text output from providers.
- Running multi-step tool-calling loops during a single agent run.

## Types & Interfaces

- `LlmProvider`
- `LlmProviderEvent`
- `LlmMessage`
- `LlmTool`
- `LlmPluginOptions`
