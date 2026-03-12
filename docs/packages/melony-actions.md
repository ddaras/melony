# @melony/actions

## Purpose

`@melony/actions` adds tool/action execution to agents.

## Main Exports

- `actions(options)` plugin
- `defineAction(definition)` helper
- action types (`ActionDefinition`, `ActionTool`, `ActionContext`, etc.)
- `ActionEvents`

## Current Contracts

- Input event: `action:call`
  - expected data: `{ id?, name, args }`
- Success event: `action:result`
  - data: `{ action, toolCallId?, result }`
- Failure event: `action:error`
  - data: `{ action, toolCallId?, error }`

State conventions:

- Exposes action capabilities under `state.actions` by default.
- This path is configurable via `capabilitiesPath`.

## Good For

- Executing trusted business logic from event handlers.
- Tool-calling workflows from LLM plugins.

## Next Documentation Additions

- JSON schema validation strategy.
- Error normalization and retry strategy.
- Namespacing recommendations for capabilities.
