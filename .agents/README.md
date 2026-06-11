# Agents Workspace

This folder is the shared coordination space for Codex, OpenCode, and the user.

## Files

- `status.md`: current repo and system state.
- `current-plan.md`: active plan and next steps.
- `decisions.md`: important decisions that should not be rediscovered.
- `handoff-opencode.md`: OpenCode writes updates here for Codex.
- `handoff-codex.md`: Codex writes updates here for OpenCode.
- `review-checklist.md`: checks to run before commit/deploy.
- `supabase-runbook.md`: how to apply and verify Supabase changes.

## Protocol

1. Read `status.md`, `current-plan.md`, and `decisions.md`.
2. Check `git status --short`.
3. Do the smallest useful unit of work.
4. Run relevant checks.
5. Update your handoff file with changed files, commands, results, risks, and next request.

