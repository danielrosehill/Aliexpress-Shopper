---
name: find-similar
description: Use when the user wants Claude to find similar products to an AliExpress listing they're viewing or have linked. Drives a text-search-based "find similar" flow in Claude in Chrome — same approach as the bundled Find Similar userscript, but Claude does it on demand instead of waiting for a card click. Trigger phrases — "find similar to this", "more like this one", "alternatives to this listing".
---

# Find Similar Listings

Search AliExpress for products similar to a reference listing.

## When to use

- User is on or has linked an AliExpress `/item/` page and wants alternatives.
- The bundled **Find Similar** userscript also offers this per-card on results pages — this skill is the on-demand equivalent for an arbitrary listing.

## Workflow

1. Resolve the reference listing:
   - If active tab is `/item/`, read its title.
   - Else if user pasted a URL, navigate a new tab to it and read the title.
2. Clean the title — strip currency, "Free Shipping", star ratings, emoji, parenthetical lot/quantity noise. Keep brand + product type + 2–3 disambiguating descriptors.
3. Build search URL: `https://www.aliexpress.com/w/wholesale-<encoded-clean-title>.html`.
4. Open in a new tab, wait for cards to render, extract the first ~15.
5. Return a markdown table; first row is the reference listing for context.

## Output

```
## Similar to: {original title}
Cleaned query: {cleaned}
Search URL: {url}

| # | Price | Title | Rating | Sold | Link |
|---|---|---|---|---|---|
| ref | {price} | {original title} | ... | ... | {original link} |
| 1 | ... | ... | ... | ... | ... |
```

## Rules

- Don't drop brand names from the title — losing those returns generic matches.
- If the cleaned title is < 3 words, ask the user to refine before searching.
- Never click into similar listings unless asked.
