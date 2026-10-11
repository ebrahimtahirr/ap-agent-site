# Progress: ap-agent-site

Status (2026-10-11): planning approved, **no site code written yet**. This folder holds only this file.

## Done
- Plan written and approved (with changes below). Source: `E:\ap-exception-agent\design\site_mockup.html`.
- Research (read-only): checked every mockup number against FINAL_RESULTS.md and heldout/results*.md;
  picked 7 real demo invoices; confirmed the PDFs, extraction output and decisions needed exist.

## Approved decisions
- Hero stat and every "0 wrong payments" claim (hero h1 area, results heading, table row label) use FINAL_RESULTS.md wording:
  0 invoices paid that the written policy said a person should review, across 392 blind invoices.
- "What broke": keep the double bill visible; add one line that 3 bank-detail-change invoices were paid in blind test 1 (policy has no such check).
- About name: Ebrahim Tahir Awan. LinkedIn: https://www.linkedin.com/in/m-ebrahim-tahir-awan-660029231/ (no longer a TODO).
- Unreadable-scan demo case is labelled "Poor scan", with honest step wording (the model read it as a statement; amount/date/lines illegible).
- Keep the Ardent Partners figures, cited as in the mockup.

## Demo cases (all from blind test 2, v1.1 replay; system outputs only, never the answer key)
clean F0001 Composite Materials CMC-2026-1885 | over tolerance F0014 Enviro Clean 4719453 | duplicate F0040 Global Bearing GBC-2026-8445A |
unknown vendor F0049 Orchard Bay Hydraulics 6915035 | partial delivery F0075 OmniFilter OT771290 (38 of 47 units, prorated) |
poor scan F0069 FlexiPack scan_113390 | account statement F0020 Fortress Steel SI-308147. Hero cycle = clean, over tolerance, duplicate.

## Number changes decided so far (files win over the mockup)
1. Blind test 1 header "v1.0" -> "v1.0.1". 2. Blind test 2 timeline "100 new invoices" -> "100 new invoices (92 scored)".
3. Cause of the 69 silent drops adds "Statement / invoice" (35 of 66). 4. "90 invoices" quantity misreads qualified "in blind test 1".
5. "56% to 99%" qualified as a replay of blind test 1 on v1.1 (development set, not blind). 6. "14 of the 18 misses" -> blind test 2 misses.
7. Heartbeat "within an hour" -> "within 30 minutes". 8. Hero stat labels say which test they come from.
Plus the "0 wrong payments" wording change above. External (Ardent) figures and "MS Business Analytics, ASU" are not verifiable from the files.

## Left to do (in order)
1. Scaffold Vite + React + TS + Tailwind (preflight off), port the mockup CSS and light/dark tokens verbatim, `base: '/ap-agent-site/'`.
2. Write `tools/build_site_demo.py` (in the AP repo; field whitelist; SELECT-only DB reads; redact bank digits in PNGs) -> `src/data/demo.json` + `public/demo/*.png`.
3. Components in mockup order: Nav+theme, Hero (animation, stats), Problem, Policy (+calculator), Solution (pipeline), Demo, Build, Results (chart, table), Broke, Limits, About, Footer; remove the "Concept mockup" banner.
4. Framer Motion animations + scroll-in; sections fully visible without JS (prerender to static HTML).
5. Playwright (`@playwright/test`; the Playwright MCP failed to connect): sections, calculator math, pipeline clicks, all 7 demo outcomes, dark/light, 390px no horizontal scroll, reduced motion.
6. Lighthouse (desktop + mobile), fix what stays within the design.
7. Secret scan, create public repo `ebrahimtahirr/ap-agent-site`, push, GitHub Pages workflow, verify live URL, re-run Lighthouse.
8. Deliver: live URL, Lighthouse scores, desktop + mobile screenshots of each section, final list of changed numbers.

## Not done / not pushed
No repo created on GitHub, nothing pushed, no Pages setup.
