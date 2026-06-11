# Marro — Project Index

Budget planner for a WCM MD student (Class of 2030, extended curriculum). Tracks grant disbursement vs planned vs actual spending across 5 academic years.

## Stack & deploy
- Single file: `index.html` (~3.4k lines) — React 18 + Babel standalone + Recharts 2.5, no build step
- Offline PWA (`sw.js`, `manifest.json`); storage `localStorage wcm_v8` + GitHub Gist sync via `api/sync.js` (Vercel serverless)
- Push to `main` → Vercel auto-deploy → https://wcm-budget.vercel.app
- Local dev: `python3 -m http.server 3456 --directory .` (see `launch.json`)

## index.html map (approximate lines, drift expected)
| Area | ~Line |
|---|---|
| CSS (focus rings, tabbar fade, glass, date-field theming) | 17–185 |
| C color tokens + CHART_COLORS | 395–450 |
| DEFAULT_STATE years | 585 |
| fmt / fmtS / fmtD / fmtA / fmtSA | 639–646 |
| Pill, TabBtn, YrBtn, Banner, Card(accent), MetricTile | 700–840 |
| RenewalDialog | 857 |
| WeekSelectorModal | 920 |
| ConflictModal | 945 |
| App state hooks | ~1000–1050 |
| saveSub / addYear / linkage logic | 1410–1620 |
| Reset + remove-year confirmations | ~1660 |
| Add category modal / deposit modal / add goal modal | 1700–1860 |
| CSV import (parseCSV, doImport, modal) | 1870–2020 |
| Header | 2007 |
| Budget tab | 2060–2260 |
| Weekly tab | 2270–2400 |
| Charts tab | 2440–2830 |
| Savings tab | 2840–3030 |
| Aid & Detail tab | 3120–3260 |
| Subscriptions tab | 3270–3380 |
| Categories tab + Key notes | 3380–3430 |

## Docs
- `DESIGN_SYSTEM.md` — tokens, semantic color rules, formatting rules (read before UI work)
- `UI_AUDIT_LOG.md` — what was found/fixed, what's still open
- `COMPONENT_LIBRARY.md` — shared components & state vocabulary
- `MOTION_SYSTEM.md` — animation rules
- `PRODUCT_DECISIONS.md` — decisions + rationale
- `FUTURE_WORK.md` — backlog

## Critical rules
1. Plan first for multi-feature work; visual-verify every UI change before declaring done
2. Credentials only in Vercel env vars
3. Read the linkage section in memory (`project_wcm_budget.md`) before touching savings/weekly/entry logic — deposits create linked weekly entries + budget overrides bidirectionally
4. Offline PWA: no new external resources (fonts, images) without self-hosting
