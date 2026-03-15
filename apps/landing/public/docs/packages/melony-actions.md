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

## Main Exports

- `actions(options)`
- `defineAction(definition)`
- `ActionEvents`
- `ActionsPluginOptions`
- `ActionDefinition`
- `ActionContext`

## Options

- `actions`: required list of action definitions to register.
- `callEventPrefix`: prefix for action call events. Defaults to `action:call:`.
- `resultEventType`: event emitted when an action succeeds. Defaults to `action:result`.
- `errorEventType`: event emitted when an action fails. Defaults to `action:error`.
- `includeInState`: if `true`, tools are injected into state. Defaults to `true`.
- `actionsPath`: state path used for injected tools. Defaults to `actions`.

## Events

- `action:call:<name>`: listens for specific action triggers.
- `action:result`: emitted when an action succeeds.
- `action:error`: emitted when an action fails.
