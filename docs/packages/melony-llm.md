# @melony/llm

## Purpose

`@melony/llm` bridges LLM providers into Melony event flows.

## Main Exports

- `llm(options)` plugin
- LLM types (`LlmProvider`, `LlmProviderEvent`, `LlmMessage`, `LlmTool`)

## Current Contracts

Provider contract:

- implement `generate(args): AsyncGenerator<LlmProviderEvent>`

Provider events supported:

- `text:delta`
- `text:done`
- `tool:call`
- `done`
- `error`

Plugin outputs:

- `llm:text:delta`
- `llm:text`
- `action:call` (when provider requests a tool)
- `llm:error`

State conventions (default selectors):

- reads messages from `state.messages`
- reads tools from `state.actions`

## Good For

- Streaming text output from providers.
- Converting provider tool calls into action events.

## Current Limitation

Tool-calling loop is currently a skeleton and can be expanded to consume `action:result` events before continuing multi-step generation.

## Next Documentation Additions

- Provider implementation guide (OpenAI/Anthropic examples).
- Message history lifecycle and memory integration.
- Tool-call roundtrip pattern.
