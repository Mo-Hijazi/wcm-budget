# Product Decisions

Decision · rationale · date.

- **Danger hue is reserved** for over-budget/destructive/errors; selection is cream. Selection-in-clay made "active" read as "wrong". (2026-06-11)
- **Actual money never rounds** (`fmtA`); plans may round (`fmt`). A money app showing $43 above a $42.50 row erodes trust. (2026-06-11)
- **No native `alert()`/silent submits** — inline `role="alert"` + disabled-until-valid. (2026-06-11)
- **CSV import skips deposits in signed exports**; all-positive files treated as debit-only (covers both bank export styles). (2026-06-11)
- **Logo picker removed** rather than wired up: pre-rebrand artifact, off-brand red WCM marks, external image breaks offline; growth-rings mark IS the brand. (2026-06-11)
- **Renewal flow prefers prefilled continuation** (next cycle date auto-suggested). (2026-06-11)
- **No alarm-red anywhere**; danger is warm clay `#E08A6B`. Over-budget = "warmth draining", calm by design. (June 2026)
- **Serif money** (Newsreader) is the brand's hero detail — applies to every monetary figure. (May 2026)
- **Destructive confirmations: Cancel dominant**, destructive ghost. Exception: low-stakes reversible removes may use filled clay. (June 2026)
- **Single-file architecture stays** until Phase 2.5b (auth + Supabase); no build step is a feature for this project. (ongoing)
- **True light theme deferred** — 🌙 toggle only subtly brightens; needs owner decision on whether a real light mode is in scope. (open)
