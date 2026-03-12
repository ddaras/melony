# Melony Docs

This folder documents the Melony ecosystem from first principles.

## Goals

- Keep docs simple and easy to scan.
- Explain how packages fit together.
- Capture current behavior without over-promising.
- Make it easy to extend docs as packages evolve.

## Start Here

1. Read `docs/concepts/communication-model.md` for the shared runtime model.
2. Read `docs/concepts/package-map.md` for package relationships.
3. Read package pages under `docs/packages/`.

## Package Docs

- `docs/packages/melony.md`
- `docs/packages/melony-agents.md`
- `docs/packages/melony-actions.md`
- `docs/packages/melony-llm.md`
- `docs/packages/melony-memory.md`
- `docs/packages/melony-workflows.md`
- `docs/packages/melony-react.md`

## Contributing

When adding features, update docs in this order:

1. Update the relevant package page.
2. Update shared concepts if contracts changed (events, state shape, lifecycle).
3. Add examples after behavior is stable.
