# @melony/workflows

## Purpose

`@melony/workflows` provides orchestration patterns for multiple agent runs.

## Main Exports

- `sequential(steps)`
- `parallel(branches)`
- `loop(options)`

## Current Contracts

Shared workflow events include:

- `workflow:start`
- `workflow:complete`
- step and loop events (`workflow:step:*`, `workflow:loop:*`)

Current patterns:

- `sequential`: runs agents one by one and emits step events
- `parallel`: executes branches concurrently and emits branch lifecycle/events as streams are multiplexed
- `loop`: repeatedly runs an agent while a condition returns `true`

## Good For

- Multi-agent pipelines.
- Iterative refinement loops.
- Structured execution boundaries around nested agent runs.

## Operational Notes

- Branches in `parallel` share the same mutable `context.state`.
- Branch-level failures emit `workflow:branch:error` and do not crash sibling branches.
- `loop` and `sequential` continue to emit the nested branch/step events, so downstream tooling can observe full flow.
