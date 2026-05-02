---
name: install-userscripts
description: Use when the user wants to install (or check the install status of) the bundled Aliexpress-Shopper userscripts — Find Similar and Hide Combo Deals. Walks through Tampermonkey/Violentmonkey install via Claude in Chrome and verifies the scripts are active. Trigger phrases — "install the userscripts", "set up the aliexpress userscripts", "is find similar working", "check my userscripts".
---

# Install Bundled Userscripts

Walk the user through installing the two userscripts shipped with this plugin and verify they're running on aliexpress.com.

## Bundled scripts

| File | Effect |
|---|---|
| `userscripts/aliexpress-find-similar.user.js` | 🔍 Similar button on every product card |
| `userscripts/aliexpress-no-combo.user.js` | Hides combo / bundle listings + adds counter toggle |

Both target `https://*.aliexpress.com/*` and `https://*.aliexpress.us/*`.

## Workflow

1. Detect the userscript manager:
   - `tabs_create_mcp` → `chrome://extensions`
   - `read_page` and look for "Tampermonkey" or "Violentmonkey".
   - If neither is found, tell the user and link [tampermonkey.net](https://www.tampermonkey.net/). Stop.
2. Resolve the plugin's userscripts directory on disk and the GitHub raw URLs:
   - Local: `<plugin-dir>/userscripts/aliexpress-find-similar.user.js`, `<plugin-dir>/userscripts/aliexpress-no-combo.user.js`
   - GitHub raw: `https://raw.githubusercontent.com/danielrosehill/Aliexpress-Shopper/main/userscripts/<file>`
3. Open each `.user.js` GitHub raw URL in a new tab — Tampermonkey/Violentmonkey will show its install prompt. Tell the user to click **Install**.
4. Verify:
   - Open `https://www.aliexpress.com/w/wholesale-test.html` in a new tab.
   - `read_page` and check for: a `.dr-find-similar-btn` element (Find Similar) and any element whose text matches `/hidden combos?/i` (no-combo counter).
   - Report which are detected.

## Output

```
## Userscript install
Manager detected: Tampermonkey | Violentmonkey | none
- Find Similar: installed ✓ | not detected
- Hide Combo Deals: installed ✓ | not detected

{next steps}
```

## Rules

- Do NOT try to script the install prompt itself — userscript managers intentionally require a human click.
- If verification fails, suggest a hard reload (`Ctrl+Shift+R`) before re-checking.
