# @melony/actions

## Purpose

`@melony/actions` lets an agent expose typed tools and execute them through events.

## Install

```bash
pnpm add @melony/actions
```

## Example

```ts
import { agent } from "@melony/agents";
import { actions, defineAction } from "@melony/actions";

const weather = defineAction({
  name: "get_weather",
  description: "Fetch weather by city",
  parameters: {
    type: "object",
    properties: {
      city: { type: "string" }
    },
    required: ["city"]
  },
  async run({ input }) {
    return { city: input.city, temperatureC: 22 };
  }
});

const assistant = agent("Assistant").use(
  actions({
    actions: [weather],
    actionsPath: "actions"
  })
);
```

## API Reference

### `actions(options)`

The primary plugin for enabling tool-calling and action execution in Melony agents.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `actions`<span class="required-asterisk">*</span> | - | List of action definitions to register. |
| `callEventPrefix` | `action:call:` | Prefix for action call events. |
| `resultEventType` | `action:result` | Event emitted when an action succeeds. |
| `errorEventType` | `action:error` | Event emitted when an action fails. |
| `includeInState` | `true` | Whether to inject tools into the run state. |
| `actionsPath` | `actions` | State path used for injected tools. |

**Events**

- `action:call:<name>`: listens for specific action triggers.
- `action:result`: emitted when an action succeeds.
- `action:error`: emitted when an action fails.

---

### `defineAction(definition)`

Utility to define a typed action with schema validation and a run handler.

## Types & Interfaces

- `ActionEvents`
- `ActionsPluginOptions`
- `ActionDefinition`
- `ActionContext`
