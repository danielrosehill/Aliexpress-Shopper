---
name: apply-filters
description: Use when the user is on an AliExpress search results page and wants Claude to toggle filters for them — Choice / free shipping / 4★+ / ship-from country / price range. Drives the live page in Claude in Chrome. Trigger phrases — "filter by free shipping", "only choice items", "4 stars and up", "ship from china only", "set price range".
---

# Apply Search Filters

Toggle AliExpress search-result filters on the live page in the user's Chrome session.

## When to use

- Active tab is an AliExpress search/category results page (`/w/wholesale-*` or `/category/*`).
- User wants any of: Choice, free shipping, 4★+, Premium, ship-from country, price range.

## Workflow

1. `tabs_context_mcp` — confirm active tab is a results page; if not, stop.
2. Map each requested filter to a stable selector (in priority order):
   - Choice: `[aria-label="filterCode:choice"]`
   - Free shipping: `[aria-label="filterCode:freeShipping"]`
   - 4★+: `[aria-label="filterCode:rating4plus"]`
   - Premium: `[aria-label="filterCode:premium"]`
   - Ship-from country: `[aria-label="<ISO-2>"]` (e.g. `CN`, `US`, `IL`, `TR`)
3. For each: scroll into view, click via `mcp__claude-in-chrome__find` + `click`, wait ~800ms for re-render.
4. Price range — find the price-range input pair, fill min/max, submit. Selectors are less stable; `find` by placeholder.
5. After all filters applied, `read_page` and report the new visible-result count.

## Output

```
## Filters applied
- {filter}: ✓
- {filter}: ✓ (with value {x})
- {filter}: ✗ — selector not found, told user

Visible results now: ~{n}
```

## Rules

- One filter at a time, with a re-render wait between — AliExpress sometimes drops state on rapid clicks.
- Never invent a filter the page doesn't have. If a selector misses, report it.
- Don't reload the page unless the user asks — applied filters are query-string state.
