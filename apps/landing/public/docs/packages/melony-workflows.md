# @melony/workflows

## Purpose

`@melony/workflows` provides orchestration helpers for sequential, parallel, and looped agent execution.

## Install

```bash
pnpm add @melony/workflows
```

## Example

```ts
import { agent } from "@melony/agents";
import { sequential, parallel, loop } from "@melony/workflows";

const classify = agent("Classify");
const summarize = agent("Summarize");
const enrich = agent("Enrich");

const pipeline = agent("Pipeline")
  .use(sequential([classify, summarize]))
  .use(parallel([summarize, enrich]))
  .use(
    loop({
      run: summarize,
      maxIterations: 3,
      while: ({ iteration }) => iteration < 3
    })
  );
```

## Main Exports

- `sequential(steps)`
- `parallel(branches)`
- `loop(options)`
- `LoopOptions`

## Options

- `sequential(steps)`: accepts an array of agent builders to run one-by-one.
- `parallel(branches)`: accepts an array of agent builders to run concurrently.
- `loop(run)`: the agent builder for each iteration.
- `loop(while)`: predicate to decide whether to continue.
- `loop(maxIterations)`: optional cap (defaults to `5`).

## Events

- `workflow:start`: emitted when a workflow begins.
- `workflow:complete`: emitted when the workflow finishes.
- `workflow:step:*`: emitted by sequential steps.
- `workflow:branch:*`: emitted by parallel branches.
- `workflow:loop:iteration:*`: emitted by loop iterations.
