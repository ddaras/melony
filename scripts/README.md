# Workspace Protocol Management Scripts

## Problem

When developing in a monorepo, you need to use `workspace:*` in package.json files to reference local packages. However, when publishing packages to npm, you need actual version numbers (e.g., `^0.1.0`).

## Solution

These scripts automatically handle the conversion between `workspace:*` and version numbers:

- **`replace-workspace-protocols.mjs`**: Replaces `workspace:*` with actual versions from workspace packages (runs during `prepack`)
- **`restore-workspace-protocols.mjs`**: Restores `workspace:*` after publishing (runs during `postpack`)

## How It Works

1. During `prepack` (before creating the tarball), the script:
   - Backs up the original package.json
   - Scans all packages in the monorepo for their versions
   - Replaces `workspace:*` dependencies with `^<version>` format
   - The modified package.json is included in the published tarball

2. During `postpack` (after creating the tarball), the script:
   - Restores the original package.json with `workspace:*` intact
   - Your source files remain unchanged for development

## Usage

The scripts are automatically integrated via npm lifecycle hooks in package.json:

```json
{
  "scripts": {
    "prepack": "node ../../scripts/replace-workspace-protocols.mjs && npm run build",
    "postpack": "node ../../scripts/restore-workspace-protocols.mjs"
  }
}
```

## Alternative Solutions

### Option 1: pnpm Built-in (Simpler but less control)
pnpm automatically replaces `workspace:*` during `pnpm publish`. However, this may not always work as expected in all scenarios.

### Option 2: Changesets (Recommended for larger teams)
[Changesets](https://github.com/changesets/changesets) is a versioning tool that handles this automatically along with changelog generation and release management.

### Option 3: Manual Script
Use a custom script to update versions before publishing (this is what these scripts do, but integrated into the publish workflow).

## Notes

- Backup files (`*.original`) are automatically created and cleaned up
- The scripts only run for packages in the `packages/` directory
- Versions are read from the actual package.json files in the workspace

