## Context

The `.qwen` folder contains configuration files for Qwen Code, the AI assistant used in this project. Over time, backup files have accumulated:
- `settings.json.orig` - a settings backup file
- Multiple command files with `.toml.backup` extension in the commands directory

These files are not actively used by Qwen and represent leftover artifacts from configuration changes or environment setup.

## Goals / Non-Goals

**Goals:**
- Clean up unused backup files to improve project hygiene
- Remove potential confusion about which settings are active
- Simplify the `.qwen` folder structure

**Non-Goals:**
- Not modifying any active configuration files (settings.json, command .toml files)
- Not affecting Qwen Code functionality
- Not changing any project code or dependencies

## Decisions

**Approach:** Simple file deletion

Since these are backup files with no active role in the system:
1. Delete `settings.json.orig` from `.qwen/`
2. Delete all `.toml.backup` files from `.qwen/commands/`

**Why this approach:**
- Backup files serve no purpose once the original is stable
- These appear to be from an earlier configuration iteration
- No migration needed - just cleanup

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Accidentally deleting a file that's still needed | Files are backups - originals remain intact. If settings.json was corrupted, the original would be restored from git history or recreated manually. |

**Note:** These backup files have `.orig` and `.backup` extensions specifically to indicate they are not active configuration.

## Migration Plan

1. Review list of backup files to confirm they're safe to delete
2. Delete backup files
3. Verify Qwen settings remain functional (no visible changes expected)

**Rollback strategy:** Not applicable - these files can be safely deleted. If for some reason the backup was needed, it would be recreated from current active config.

## Open Questions

None - this is a straightforward cleanup operation with clear objectives and no technical complexity.
