# Future Work

Prioritized backlog. Check off + move to UI_AUDIT_LOG when done.

## P1 — owner decision needed
- [ ] **True light theme or remove the 🌙 toggle.** Today it only subtly brightens the dark theme; users expecting light mode will think it's broken. Decide: full light palette (real token work: text, glass alphas, chart colors) or replace the toggle with nothing.
- [ ] **Conflict modal live test** — never triggered with real sync data; exercise once Gist sync is reachable (two devices or two tabs with forced divergence).

## P2 — quality
- [ ] `prefers-reduced-motion` fallback for ambient blobs (and audit other keyframes).
- [ ] "Spending distribution" chart shows the *plan*, not actuals — retitle ("Planned breakdown — June") or switch to actuals once logged data exists.
- [ ] Self-host Newsreader/Inter (currently Google Fonts; offline PWA loads stale-cached fonts at best).
- [ ] Focus trap + `aria-modal` on Modal; Esc-to-close.
- [ ] Mobile tables (5-year overview, COA): no visible scroll affordance until touched — consider edge fade like `.tabbar`.
- [ ] "incl. $15 subs" sublabel rounds while the row shows $15.49 — minor copy inconsistency.

## P3 — opportunities
- [ ] Step exam fund chip says "On track 0%" (Step 1) but bare "0%" (Step 3, no contribution) — unify to explicit states: On track / No monthly contribution / Funded.
- [ ] CSV import: remember per-merchant category corrections (extend `autoCategory` with learned map in state).
- [ ] Browse-weeks modal: show entry count next to each archived week's total.
- [ ] Empty Subscriptions Summary card and "0 subscriptions" card say nearly the same thing — collapse into one empty state.
- [ ] Phase roadmap: 2.5 Step 4 (typography pass) → Phase 2.5b (Auth + Supabase).
