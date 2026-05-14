## Why

The `.qwen` folder contains backup files that have accumulated over time:
- `settings.json.orig` - an old settings backup
- Multiple `.toml.backup` files in the commands directory (`opsx-*.toml.backup`)

These backup files are unnecessary as Qwen's settings should be managed through the main configuration, and the backup files appear to be artifacts from a previous setup that were not cleaned up. Removing them improves folder hygiene and reduces confusion.

## What Changes

- Delete `settings.json.orig` in `.qwen/` directory
- Delete all `.toml.backup` files in `.qwen/commands/` directory:
  - `opsx-apply.toml.backup`
  - `opsx-archive.toml.backup`
  - `opsx-explore.toml.backup`
  - `opsx-propose.toml.backup`

## Capabilities

### New Capabilities
None - this is a cleanup operation with no new capabilities.

### Modified Capabilities
None - this only removes backup files, no existing functionality is affected.

## Impact

**Affected code**: None (deletion of unused backup files)

**API changes**: None

**Dependencies**: None

**Breaking changes**: No - these are non-functional backup files that serve no purpose in the application. Removing them improves project hygiene without any impact on functionality.
