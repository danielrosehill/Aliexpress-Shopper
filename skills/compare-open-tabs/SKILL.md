---
name: compare-open-tabs
description: Use when the user has multiple AliExpress listing tabs open and wants Claude to compare them side-by-side. Reads each AliExpress tab via Claude in Chrome and produces a comparison table — price, rating, sold count, shipping, key specs. Trigger phrases — "compare these tabs", "which of these is better", "compare my open aliexpress tabs", "side by side".
---

# Compare Open AliExpress Tabs

Build a side-by-side comparison of every AliExpress listing the user currently has open.

## When to use

- User has 2+ AliExpress `/item/` tabs open and wants a comparison.
- They asked "which is better", "cheapest", "best value", etc., across tabs.

## Workflow

1. `tabs_context_mcp` — list all tabs, filter to those whose URL contains `aliexpress.com/item/` or `aliexpress.us/item/`.
2. If fewer than 2 match, tell the user and stop.
3. For each matching tab, `read_page` to extract: title, price, original price, discount, rating, reviews, sold, primary shipping option, key variants, store name.
4. Build a comparison table sorted by price ascending (preserving the source currency — do NOT convert).
5. Add a short verdict paragraph: cheapest, best-rated, best shipping, best apparent value (price × rating × sold). Be honest about thin data.

## Output

```
## Comparing {n} AliExpress tabs

| # | Price | Title | Rating | Sold | Shipping | Store |
|---|---|---|---|---|---|---|

### Verdict
- Cheapest: ...
- Best rated: ...
- Best apparent value: ...
- Watch-outs: ...
```

## Rules

- Do not navigate or click within tabs — read-only.
- Mixed currencies across tabs: flag in the verdict, do not silently convert.
- Tabs that fail to read get a row with "—" and a note in the watch-outs section.
