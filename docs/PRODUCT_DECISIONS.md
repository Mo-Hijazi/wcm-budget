# Product Decisions

Decision · rationale · date.

- **Neutral dual-theme identity replaces green "candlelight"** — dark = warm near-black `#101210`, light = warm off-white `#F5F4EF`, both with dynamic blobs; marigold + cream + growth rings carry the brand. Rationale: the green ambient layer raised red-green colorblindness concerns and tied the look to one mood; neutral scales to a national audience. (2026-06-11)
- **Blue vs amber is the positive/negative data pair** (`pos #82AEDB` / `neg #E5A23E` dark) — chosen for deuteranopia/protanopia distinguishability; always paired with signs/labels. Info banners moved to slate so blue unambiguously means "positive". (2026-06-11)
- **Destructive stays clay, and is now a separate token from negative data** (`danger` vs `neg`). Amber-as-danger would collide with over-budget semantics; clay buttons are always labeled so the colorblind concern doesn't apply to them. (2026-06-11)
- **Theme persists in the existing `darkMode` sync field**; legacy states were force-migrated to dark once (the old toggle was inert — no user ever chose light); fresh users follow `prefers-color-scheme`. (2026-06-11)
- **De-Cornell is visible-UI only for now** — copy, manifest, icon de-branded; YEAR_CONFIGS amounts/housing notes stay as the user's own data. Full school-agnostic onboarding remains Phase 3. The COA source line stays as data provenance. (2026-06-11)
- **Icons are hand-drawn ring-derived SVGs**, not an icon library — brand cohesion with the rings logo, no external dependency, marigold dot reserved for savings/live. BRANDS letter-tiles keep their glyphs (content, not chrome). (2026-06-11)
- **Goal progress is circular (RingProgress)**; budget/weekly bars stay linear — rings = growth metaphor for goals, bars = consumption against a cap. (2026-06-11)
- **Fonts are self-hosted variable woff2** (OFL) — an offline PWA must not depend on Google Fonts at runtime. (2026-06-11)
- **Blob health states crossfade stacked gradient layers by opacity** — calm / low-tide (over budget) / 9s marigold bloom (goal funded); gradients themselves are never animated (GPU rule). (2026-06-11)
- **Danger hue is reserved** for destructive/errors; selection is cream (dark) / ink (light). Selection-in-clay made "active" read as "wrong". (2026-06-11)
- **Actual money never rounds** (`fmtA`); plans may round (`fmt`). A money app showing $43 above a $42.50 row erodes trust. (2026-06-11)
- **No native `alert()`/silent submits** — inline `role="alert"` + disabled-until-valid. (2026-06-11)
- **CSV import skips deposits in signed exports**; all-positive files treated as debit-only (covers both bank export styles). (2026-06-11)
- **Logo picker removed** rather than wired up: pre-rebrand artifact, off-brand red WCM marks, external image breaks offline; growth-rings mark IS the brand. (2026-06-11)
- **Renewal flow prefers prefilled continuation** (next cycle date auto-suggested). (2026-06-11)
- **No alarm-red anywhere**; danger is warm clay. Over-budget = "warmth draining" (low-tide), calm by design. (June 2026)
- **Serif money** (Newsreader) is the hero detail — display money ≥ ~16px; small inline amounts stay Inter for legibility. (May 2026, refined 2026-06-11)
- **Destructive confirmations: Cancel dominant**, destructive ghost. Exception: low-stakes reversible removes may use filled clay. (June 2026)
- **Single-file architecture stays** until Phase 2.5b (auth + Supabase); no build step is a feature for this project. (ongoing)
