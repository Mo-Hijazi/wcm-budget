# Future Work

Prioritized backlog. Check off + move to UI_AUDIT_LOG when done.
(June 11 2026 overhaul cleared: light theme, self-hosted fonts, modal a11y, table edge fade, blob reduced-motion, chip states, empty-state consolidation, subs rounding, pie retitle.)

## P1
- [ ] **Conflict modal live test** — never triggered with real sync data; exercise once Gist sync is reachable (two devices or two tabs with forced divergence). Note: `darkMode` now actually diverges across devices, so a real conflict is easier to force.

## P2 — quality
- [ ] **apple-touch-icon is an SVG** — iOS ignores SVG touch icons and screenshots the page instead. Export a 180×180 PNG of the rings icon and point `<link rel="apple-touch-icon">` at it.
- [ ] Dual `<meta name="theme-color">` with `media="(prefers-color-scheme)"` for pre-JS browser chrome (JS already updates it post-load); revisit `apple-mobile-web-app-status-bar-style` for light theme.
- [ ] Light-theme polish pass on `.mc-sp` specular and `.mc-sh` shimmer (white-on-white is currently invisible — harmless but wasted).
- [ ] Sweep remaining hardcoded cream rgba stragglers in JSX for light theme (e.g. MarroLogo tile ring shadow, week-pill border ~`rgba(246,239,221,0.45)`).

## P3 — opportunities (incl. deferred from Phase 2.5)
- [ ] Tab bar redesign: floating glass pill detached from content, cross-fade tab transitions.
- [ ] Charts: gradient fills + draw-on animation, themed `cursor` fills audit.
- [ ] Number-roll animation on MetricTile values.
- [ ] CSV import: remember per-merchant category corrections (extend `autoCategory` with learned map in state).
- [ ] Browse-weeks modal: show entry count next to each archived week's total.
- [ ] Bloom state currently triggers only from "Log deposit" — also trigger when a weekly exams entry overflows a goal to fully funded.
