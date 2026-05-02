---
name: aliexpress-search
description: Search aliexpress.com in the user's browser via Claude in Chrome and return visible results. Hands off to the `search-aliexpress` skill.
---

# /aliexpress-search

Run a text search on aliexpress.com in the user's live Chrome session.

Usage: `/aliexpress-search <query>`

This invokes the `search-aliexpress` skill. Results come from whatever locale, currency, and login state the user already has on aliexpress.com — no IL-specific defaults applied here. For IL-context shopping (ILS, Hebrew, IL reviews, landed-cost) use the `israel-shopping` plugin instead.
