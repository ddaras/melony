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

## API Reference

### `sequential(steps)`

Runs a list of agents or plugins in sequence.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `steps`<span class="required-asterisk">*</span> | - | Array of agent builders to run one-by-one. |

---

### `parallel(branches)`

Runs multiple agents or plugins concurrently.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `branches`<span class="required-asterisk">*</span> | - | Array of agent builders to run concurrently. |

---

### `loop(options)`

Repeats an agent or plugin execution based on a condition.

**Options**

| Param | Default | Description |
| :--- | :--- | :--- |
| `run`<span class="required-asterisk">*</span> | - | The agent builder for each iteration. |
| `while`<span class="required-asterisk">*</span> | - | Predicate to decide whether to continue. |
| `maxIterations` | `5` | Optional cap on total iterations. |

**Events**

- `workflow:start`: emitted when a workflow begins.
- `workflow:complete`: emitted when the workflow finishes.
- `workflow:step:*`: emitted by sequential steps.
- `workflow:branch:*`: emitted by parallel branches.
- `workflow:loop:iteration:*`: emitted by loop iterations.

## Types & Interfaces

- `LoopOptions`
