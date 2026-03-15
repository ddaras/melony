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

## Main Exports

- `planning(options)`
- `planner(options)`
- `createDefaultPlannerStrategy(options)`
- `PlannerOptions`
- `PlanningEvents`

## Options

- `provider`: LLM provider used to build the default strategy.
- `strategy`: optional custom strategy with `createPlan(...)`.
- `toolName`: name for the planning tool. Defaults to `plan`.
- `updateToolName`: name for updating step state. Defaults to `update_plan_step`.
- `maxAttemptsPerStep`: retry ceiling for a single step.
- `maxReplans`: maximum number of replanning attempts.
- `strategyOptions`: options forwarded to the default strategy.

## Events

- `plan:create`: emitted when a new plan is requested.
- `plan:step:update`: emitted when a step status changes.
- `plan:complete`: emitted when all steps become `completed`.
