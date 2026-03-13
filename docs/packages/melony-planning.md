# @melony/planning

## Purpose

`@melony/planning` provides a production planning lifecycle for Melony agents:

- plan creation,
- step execution with retries,
- replanning with bounded attempts,
- completion/failure signaling.

## Main Exports

- `planning(options)`
- `planner(options)`
- `createDefaultPlannerStrategy(options)`

## Core Events

- `plan:create`
- `plan:created`
- `plan:step:start`
- `plan:step:result`
- `plan:replan`
- `plan:complete`
- `plan:failed`

## Strategy Contract

`planning()` is strategy-driven. For dynamic plan generation you can either provide:

- `strategy.createPlan(...)` (required unless `plan:create` provides explicit steps),
- `strategy.executeStep(...)` (optional; defaults to `action:call` when `step.action` exists),
- `strategy.replan(...)` (optional; required if you emit `plan:replan`).

Or use the built-in provider adapter:

- pass `provider` to `planning()` / `planner()`,
- optionally pass `strategyOptions` for prompt/message/parser customization.

`planner()` is a strict wrapper over `planning()` and requires either:

- `strategy.createPlan()`, or
- `provider` (which auto-builds a default strategy via `createDefaultPlannerStrategy()`).

## Operational Notes

- Retry behavior is controlled by `maxAttemptsPerStep`.
- Replan ceiling is controlled by `maxReplans`.
- The active plan lives in `state.plan` and includes `cursor`, `replans`, and per-step status.

## Usage

```ts
import { planner } from "@melony/planning";
import { createGeminiProvider } from "@melony/llm-gemini";

const provider = createGeminiProvider({
  apiKey: process.env.GEMINI_API_KEY
});

agent("Assistant")
  .use(actions({ actions: [/* ... */] }))
  .use(
    planner({
      provider,
      strategyOptions: {
        maxPlanSteps: 8
      }
    })
  );
```
