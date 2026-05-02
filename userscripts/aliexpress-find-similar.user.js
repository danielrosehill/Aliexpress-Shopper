// ==UserScript==
// @name         AliExpress — Find Similar (inline)
// @namespace    https://github.com/danielrosehill
// @version      0.1.0
// @description  Adds a "Find Similar" button overlay on each product card on AliExpress search/category pages, so you don't have to open the listing first.
// @author       Daniel Rosehill
// @match        https://*.aliexpress.com/*
// @match        https://*.aliexpress.us/*
// @run-at       document-idle
// @grant        GM_openInTab
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    const BTN_CLASS = 'dr-find-similar-btn';
    const MARKED_ATTR = 'data-dr-find-similar';

    GM_addStyleSafe(`
        .${BTN_CLASS} {
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 9999;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: 600;
            line-height: 1.2;
            color: #fff;
            background: rgba(230, 70, 30, 0.92);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
            opacity: 0.85;
            transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .${BTN_CLASS}:hover {
            opacity: 1;
            transform: translateY(-1px);
        }
        .${BTN_CLASS}:active { transform: translateY(0); }
    `);

    function GM_addStyleSafe(css) {
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    function openTab(url) {
        if (typeof GM_openInTab === 'function') {
            GM_openInTab(url, { active: true, insert: true });
        } else {
            window.open(url, '_blank', 'noopener');
        }
    }

    // Extract a usable title from a card. Falls back through several signals.
    function extractTitle(card, anchor) {
        // 1. Anchor's title attr
        if (anchor && anchor.title && anchor.title.trim().length > 4) return anchor.title.trim();
        // 2. Image alt
        const img = card.querySelector('img[alt]');
        if (img && img.alt && img.alt.trim().length > 4) return img.alt.trim();
        // 3. Heading-ish element with the longest text under the card
        const candidates = card.querySelectorAll('h1, h2, h3, h4, span, div');
        let best = '';
        candidates.forEach(el => {
            const t = (el.textContent || '').trim();
            if (t.length > best.length && t.length < 200 && /[a-zA-Z]/.test(t)) best = t;
        });
        return best;
    }

    function buildSimilarUrl(title) {
        // AliExpress text search — closest stable approximation of "find similar".
        // Strip currency, ratings noise, and punctuation that confuses the search.
        const cleaned = title
            .replace(/[€$£¥₪]\s*\d[\d.,]*/g, ' ')
            .replace(/\b\d+(\.\d+)?\s*(stars?|sold|reviews?|orders?)\b/gi, ' ')
            .replace(/[|•·,/\\]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 120);
        return `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(cleaned).replace(/%20/g, '-')}.html`;
    }

    // Find the card-like ancestor of an item anchor.
    function findCard(anchor) {
        let el = anchor;
        for (let i = 0; i < 8 && el && el.parentElement; i++) {
            el = el.parentElement;
            const r = el.getBoundingClientRect();
            // A real card is roughly square-ish and at least ~150px wide.
            if (r.width >= 150 && r.height >= 150) return el;
        }
        return anchor.parentElement;
    }

    function injectButtons() {
        const anchors = document.querySelectorAll('a[href*="/item/"]:not([' + MARKED_ATTR + '])');
        anchors.forEach(a => {
            // Skip anchors that don't contain a product image (avoids tagging breadcrumb/related links).
            if (!a.querySelector('img')) return;

            const card = findCard(a);
            if (!card) return;
            if (card.querySelector('.' + BTN_CLASS)) {
                a.setAttribute(MARKED_ATTR, '1');
                return;
            }

            // Ensure the card can host an absolutely-positioned button.
            const cs = getComputedStyle(card);
            if (cs.position === 'static') card.style.position = 'relative';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = BTN_CLASS;
            btn.textContent = '🔍 Similar';
            btn.title = 'Open a search for similar products in a new tab';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const title = extractTitle(card, a);
                if (!title) {
                    alert('Could not read product title from this card.');
                    return;
                }
                openTab(buildSimilarUrl(title));
            }, true);

            card.appendChild(btn);
            a.setAttribute(MARKED_ATTR, '1');
        });
    }

    // Initial pass + watch for SPA / lazy-rendered cards.
    injectButtons();
    let pending = false;
    const obs = new MutationObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            injectButtons();
        });
    });
    obs.observe(document.body, { childList: true, subtree: true });
})();
