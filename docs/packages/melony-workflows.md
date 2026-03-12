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
- `parallel`: placeholder structure for fan-out/fan-in behavior
- `loop`: repeatedly runs an agent while a condition returns `true`

## Good For

- Multi-agent pipelines.
- Iterative refinement loops.
- Structured execution boundaries around nested agent runs.

## Next Documentation Additions

- Parallel multiplexing semantics.
- Shared-state strategy between branches.
- Failure and cancellation policy.
