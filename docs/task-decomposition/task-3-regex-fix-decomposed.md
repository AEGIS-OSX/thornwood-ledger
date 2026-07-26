# Task-3: regex-fix — Decomposed Sub-Tasks
**Ticket:** e132ea15-5cb4-40b9-ad2c-a5dd0f81dcf8
**Project:** f0757e3c-ba4f-4598-bed6-8c5039eb7c95
**Pipeline run:** 937d2a11-e40a-46b2-9d22-d11ef103e850
**Root cause:** Original task-3:regex-fix was underscoped — no file path, no pattern literals, no scoped acceptance criteria. Worker-coder timed out at 240s.
**Investigation result:** AEGIS-OSX/thornwood-ledger contains zero regex patterns in source code (searches for `regex`, `RegExp`, `match(/`, `replace(/` all returned 0 results as of 2026-07-26). The repo is a Next.js landing page with no regex logic.

---

## Sub-Task T3A — Validate Absence of Regex Patterns

TASK ID: T3A
ASSIGNED TO: workerT1
TIER: T1
TITLE: Confirm no regex patterns exist in thornwood-ledger source
DESCRIPTION: The original task-3:regex-fix assumed regex patterns existed in the codebase. This sub-task verifies that assumption. Search the repo for any regex literals or RegExp usage. If found, document the file path, line number, current pattern, and required replacement. If not found, confirm the task is a false positive and close.
FILES TO CREATE: none
FILES TO MODIFY: none (read-only verification)
DO NOT TOUCH: all source files
DEPENDENCIES: none
INTERFACE CONTRACT: Output is a written confirmation: either "CONFIRMED: no regex patterns found in [list of files checked]" or "FOUND: [file path]:[line number] — current: [pattern] — replacement: [pattern]"
ACCEPTANCE CRITERIA:
  1. Run `grep -rn "RegExp\|\/.*\/[gimsuy]*" app/ --include="*.ts" --include="*.tsx" --include="*.js"` — must return zero matches to confirm false positive.
  2. Run `grep -rn "\.match(\|\.replace(\|\.test(\|\.search(" app/ --include="*.ts" --include="*.tsx"` — must return zero matches.
  3. Worker posts written confirmation in reply text.
BRANCH NAME: ticket-fix/e132ea15
ESTIMATED COMPLEXITY: T1

---

## Sub-Task T3B — Update Pipeline Task Spec to Require File-Level Scoping

TASK ID: T3B
ASSIGNED TO: workerT1
TIER: T1
TITLE: Add file-scoping guard to pipeline task-3 spec template
DESCRIPTION: The pipeline task spec for "regex-fix" lacked required fields: exact file path, current pattern as string literal, replacement pattern as string literal, and line number. This caused the 240s timeout. Add a validation comment block to the task spec template (if one exists in the repo) or create a TASK_SPEC_REQUIREMENTS.md at docs/ level documenting the mandatory fields for any future regex-fix task. This is a documentation-only change.
FILES TO CREATE: docs/TASK_SPEC_REQUIREMENTS.md (if no existing template found)
FILES TO MODIFY: existing task spec template file if found at docs/ or .pipeline/ or similar
DO NOT TOUCH: app/, public/, package.json, tsconfig.json, next.config.js, tailwind.config.ts, postcss.config.js, design_tokens.json
DEPENDENCIES: T3A must complete first (confirms no live regex fix needed)
INTERFACE CONTRACT: Output is a markdown file at docs/TASK_SPEC_REQUIREMENTS.md containing mandatory fields for regex-fix tasks.
ACCEPTANCE CRITERIA:
  1. Run `grep -n "exact file path" docs/TASK_SPEC_REQUIREMENTS.md` — must return at least one match.
  2. Run `grep -n "current pattern" docs/TASK_SPEC_REQUIREMENTS.md` — must return at least one match.
  3. Run `grep -n "replacement pattern" docs/TASK_SPEC_REQUIREMENTS.md` — must return at least one match.
  4. No files outside docs/ are modified.
BRANCH NAME: ticket-fix/e132ea15
ESTIMATED COMPLEXITY: T1

---

## Merge Order
T3A first (verification). T3B second (documentation). Both are T1 and complete well within 240s.

## Notes
- No code changes required. The original regex-fix task was a false positive on the code side; the real fix is process documentation.
- If T3A finds regex patterns that were missed, escalate to sterling with the exact file path and pattern before proceeding.
