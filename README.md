# HNG Stage 0 Todo Card - Enhanced

## What Changed (Old → New)

**Status Controls:**
- **Old:** Checkbox toggles "Pending"/"Done" badge only.
- **New:** Added `<select data-testid="test-todo-status-control">` (Pending/In Progress/Done). Bidirectional sync: checkbox ↔ select ↔ badge ↔ visuals (line-through, opacity).

**A11y & Keyboard Flow:**
- **Old:** Basic aria-labels.
- **New:** aria-expanded/controls on toggle button. Tab: checkbox → status → toggle → edit/delete. aria-live polite on time.

**Time Management:**
- **Old:** "Overdue!", "Due in X days/hours/minutes/now".
- **New:** Granular overdue "Overdue by 1 hour", red badge (`test-todo-overdue-indicator`), "Completed" when Done (stops updating).

**Collapsible Description:**
- Toggle button hides/shows description (per feedback).

## New Design Decisions
- **State-Driven:** `currentStatus` + `setStatus()` centralizes sync (DRY).
- **Segmented Select:** CSS pill-style for modern segmented control look.
- **Purple toggle btn:** Matches app theme, icon rotates.
- **Overdue Badge:** Compact red pill next to due date.
- **30s Update:** Efficient timer.

## Known Limitations
- Single todo (no list).
- Delete alerts (no actual delete).
- No persistence (reload resets state).
- Edit doesn't save status (future enhancement).
- Toggle icon text-swap (CSS rotate preferred, but reliable).

## Accessibility Notes
- Full labels/for, aria-labels.
- `aria-expanded="false/true"` + `aria-controls="id"` on toggle.
- `aria-live="polite"` time updates.
- Focus management: Edit modal trap, return focus.
- High contrast, keyboard-navigable.

Test in browser: All interactions, tab flow, screenreader announces states. Fully compliant! 🚀
