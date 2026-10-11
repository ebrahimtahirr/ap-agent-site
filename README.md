# AP Exception Agent: portfolio site

Static case-study site for the AP Exception Agent (an n8n + Claude + Postgres + QuickBooks-sandbox project that reads supplier invoices, checks them against purchase orders and receipts, pays the clean ones and sends the rest to a person).

Vite + React + TypeScript + Tailwind (prefixed utilities only) + Framer Motion. No backend. The built page is prerendered, so every section is readable without JavaScript.

```
npm install
npm run dev          # local development
npm run build        # typecheck, build, prerender into dist/
npm run preview      # serve dist/ at http://localhost:4173/ap-agent-site/
npm run test:unit    # tolerance maths
npx playwright install chromium && npm test   # browser tests (start from a fresh build)
node scripts/lighthouse.mjs <url> <label>     # mobile + desktop Lighthouse scores
node scripts/screenshots.mjs <url>            # section screenshots into screenshots/
```

## Where things come from

- `src/styles/mockup.css` is the approved design's CSS, unchanged. `src/styles/overrides.css` holds the only deviations.
- `src/data/content.ts` holds all copy and numbers. They are taken from the project's final results (blind test 1: 300 invoices, v1.0.1; blind test 2: 92 scored of 100, v1.1). The Ardent Partners benchmarks are external and cited on the page.
- `src/data/demo.json` and `public/demo/*.png` are built from seven real invoices of blind test 2 (system outputs only, bank digits blacked out) by a script in the private project repo.

All invoices, vendors and companies are synthetic. QuickBooks sandbox only.
