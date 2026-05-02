---
name: search-aliexpress
description: Use when the user wants to search aliexpress.com in their own browser (Claude in Chrome) and have Claude read back the visible results. Drives the search results page directly in the user's existing AliExpress session — respects whatever locale, currency, and login state they already have set up. Trigger phrases — "search aliexpress for X", "aliexpress search X", "find X on aliexpress", "open aliexpress and look for X".
---

# Search AliExpress (browser)

Run a text search on aliexpress.com in the user's live Chrome session and return a concise readout of the visible product cards.

## When to use

- User has Claude in Chrome enabled and wants to shop interactively.
- They want results in their own session (their locale, currency, account, saved addresses, recommendations).
- They will keep clicking through — this skill seeds the page; the user takes it from there.

Do NOT use this for headless scraping, programmatic price comparison, or IL-specific landed-cost work — for IL-context, use the `israel-shopping` plugin.

## Inputs

- `query` (required) — free-text product query.
- `tab` (optional) — `new` (default) or `current` if the user is already on aliexpress.com and wants to reuse the active tab.

## Workflow

1. Call `mcp__claude-in-chrome__tabs_context_mcp` to see what's open.
2. URL-encode the query and build `https://www.aliexpress.com/w/wholesale-<encoded>.html`.
3. Open it via `tabs_create_mcp` (or `navigate` if reusing a tab).
4. Wait for results to render (`read_page` until product cards appear; up to ~5s).
5. Extract the first ~20 visible cards: title, price (as shown on page — do NOT convert currency), rating, orders/sold, shipping note, link.
6. Return a compact markdown table. Do NOT click into individual listings unless the user asks.

## Output

```
## AliExpress: {query}
URL: {results url}
Locale/currency on page: {detected from page chrome}

| # | Price | Title | Rating | Sold | Link |
|---|---|---|---|---|---|
```

Append a one-line note if the **Hide Combo Deals** userscript is detected as active (look for the floating counter in the DOM) — confirms results are pre-filtered.

## Rules

- Never quote a price you didn't read off the page.
- Don't switch the user's locale/currency — that's their setting.
- If aliexpress.com shows a login wall, captcha, or region prompt, stop and tell the user; don't try to dismiss it.
