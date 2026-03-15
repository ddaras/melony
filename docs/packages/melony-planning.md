# @melony/planning

## Purpose

`@melony/planning` adds plan creation and step progress tracking to agents.

## Install

```bash
pnpm add @melony/planning
```

## Example

```ts
import { agent } from "@melony/agents";
import { actions } from "@melony/actions";
import { planner } from "@melony/planning";
import { createGeminiProvider } from "@melony/gemini";

const provider = createGeminiProvider({
  apiKey: process.env.GEMINI_API_KEY
});

const assistant = agent("Assistant")
  .use(actions({ actions: [] }))
  .use(
    planner({
      provider,
      strategyOptions: {
        maxPlanSteps: 8
      }
    })
  );
```

## API Reference

### `planner(options)`

Adds plan creation and step progress tracking to agents.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `provider` | - | LLM provider used for the default strategy. |
| `strategy` | - | Custom strategy implementation. |
| `toolName` | `plan` | Name for the planning tool. |
| `updateToolName` | `update_plan_step` | Name for updating step state. |
| `maxAttemptsPerStep` | - | Retry ceiling for a single step. |
| `maxReplans` | - | Maximum number of replanning attempts. |
| `strategyOptions` | - | Options forwarded to the strategy. |

**Events**

- `plan:create`: emitted when a new plan is requested.
- `plan:step:update`: emitted when a step status changes.
- `plan:complete`: emitted when all steps become `completed`.

---

### `planning(options)`

Alias for `planner(options)`.

### `createDefaultPlannerStrategy(options)`

Factory for the default planning strategy used by the planner.

## Types & Interfaces

- `PlannerOptions`
- `PlanningEvents`
