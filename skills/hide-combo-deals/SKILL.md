---
name: hide-combo-deals
description: Use when the user wants to verify, query, or toggle the bundled "Hide Combo Deals" userscript on the active AliExpress page — confirm it's loaded, report how many Max Combo / bundle listings it has excluded, or click its Show/Hide button to flip visibility. Trigger phrases — "hide combos", "show combos again", "how many combos hidden", "is the combo blocker working", "toggle combo deals".
---

# Hide Combo Deals (userscript control)

Drive the floating badge injected by `aliexpress-no-combo.user.js` (v2) on the active AliExpress tab — verify it's there, read its counter, and click its Show/Hide toggle.

## When to use

- User asks whether the combo blocker is running, how many it has hidden, or wants to flip the toggle.
- After running `/aliexpress-search` and the user wants to peek at the excluded combos without reloading.

For initial install, use `install-userscripts` instead.

## What the userscript exposes (DOM contract)

The script mounts a floating badge with id `#no-combo-badge` containing:

- A `<span>` with text matching `/^\d+ Max Combo deals? (excluded|shown)$/`
- A `<button>` whose text is `Show` (combos currently hidden) or `Hide` (combos currently shown)

It hides combo cards by setting `display: none` on each `.search-item-card-wrapper-gallery` whose inner `.search-card-item` text contains any of: `max combo`, `combo deal`, `bundle deal`, `buy more save more`, `more to love` (case-insensitive, NBSP-normalised).

## Workflow

1. `tabs_context_mcp` — confirm active tab is on `aliexpress.com` (or `.us`) and is a search/category/listing page where combos appear.
2. `read_page` and look for `#no-combo-badge`. If absent:
   - The script isn't installed, isn't enabled for this page, or hasn't run yet.
   - Suggest `/aliexpress-install-userscripts` or a hard reload (`Ctrl+Shift+R`). Stop.
3. Parse the counter span — extract the integer and the `excluded|shown` state.
4. Report state to the user.
5. If the user asked to **toggle**: `mcp__claude-in-chrome__find` the button inside `#no-combo-badge`, then `click` it. Wait ~300ms. Re-read the counter and confirm the state flipped.

## Output

```
## Hide Combo Deals
Userscript: active ✓ (v2.x — toggle UI present)
Currently: {N} Max Combo deals {excluded | shown}
{If toggled: → flipped to {new state}}
```

If not detected:

```
## Hide Combo Deals
Userscript: not detected on this page
Try: /aliexpress-install-userscripts, or hard-reload the tab (Ctrl+Shift+R).
```

## Rules

- Don't try to recreate the script's hiding logic in JS via `playwright_evaluate` — defer to the userscript. This skill only reads the badge and clicks the button.
- If the page has zero combo listings, the badge auto-hides (`display: none`); treat that as "active, 0 excluded", not "not installed". Detect by querying `#no-combo-badge` directly even if not visible.
- Toggle is idempotent — calling twice returns to the original state. If the user asks to "hide combos" and they're already hidden, just confirm without clicking.
