---
name: read-current-listing
description: Use when the user is already on an AliExpress product page in their browser and asks Claude to summarise / evaluate / extract data from "this listing" or "the page I'm on". Reads the active tab via Claude in Chrome — does not navigate or scrape externally. Trigger phrases — "what's on this page", "summarise this listing", "read this aliexpress page", "is this a good deal", "extract the specs".
---

# Read Current AliExpress Listing

Pull a structured summary of the AliExpress product page the user is currently viewing.

## When to use

- The user explicitly references "this page", "this listing", "the one I'm on", or pastes nothing but expects context.
- They want a digest, a sanity check, or a structured extraction (specs / variants / shipping options).

## Workflow

1. `tabs_context_mcp` — confirm the active tab is on `aliexpress.com` or `aliexpress.us` and the URL contains `/item/`. If not, ask the user to switch tabs.
2. `read_page` (or `get_page_text`) on that tab.
3. Extract:
   - Title
   - Seller / store name + rating
   - Current price (as shown) + original price + discount %
   - Variants available (colour / size / plug type / etc.)
   - Star rating + review count + orders/sold
   - Shipping options visible (carrier, ETA, cost)
   - Return/refund policy line
   - Bullet specs from the description tab if visible
4. Return a clean markdown summary.

## Output

```
## {title}
Store: {store} ({store rating})
Price: {price} (was {original}, {discount}%)
Rating: {stars} ({reviews} reviews, {sold} sold)

### Variants
- ...

### Shipping
- ...

### Notes
- {anything noteworthy: combo-only, app-only price, low review count, etc.}
```

## Rules

- Do not click variant selectors to enumerate prices unless the user asks — that mutates the page.
- Do not assume currency; quote it as it appears.
- If the page is partially loaded, say so rather than inventing fields.
