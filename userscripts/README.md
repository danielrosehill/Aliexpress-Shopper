# Userscripts

Bundled userscripts that augment aliexpress.com when shopping with Claude in Chrome. Install once via [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge) or Violentmonkey (Firefox) — they then run automatically on every aliexpress.com page Claude opens.

| Script | What it does |
|---|---|
| [`aliexpress-find-similar.user.js`](./aliexpress-find-similar.user.js) | Adds a 🔍 **Similar** button overlay on each product card on search/category pages. Click → opens a text-search for similar items in a new tab. |
| [`aliexpress-no-combo.user.js`](./aliexpress-no-combo.user.js) | Hides combo / bundle / "Max Combo" listings from search and listing pages. Floating counter + show/hide toggle. |

## Install (manual)

1. Install Tampermonkey or Violentmonkey in your browser.
2. Open the `.user.js` raw file in your browser — the userscript manager will prompt to install.
3. Reload any open aliexpress.com tab.

## Install (Claude-driven)

Run `/aliexpress-install-userscripts` and Claude will walk you through it via Claude in Chrome.

## Upstream

These scripts originate from:

- [danielrosehill/Aliexpress-Find-Similar-Userscript](https://github.com/danielrosehill/Aliexpress-Find-Similar-Userscript)
- [danielrosehill/AliExpress-No-Combo-Deals](https://github.com/danielrosehill/AliExpress-No-Combo-Deals)

The copies in this plugin may lag the upstream repos. For the latest version, check upstream.
