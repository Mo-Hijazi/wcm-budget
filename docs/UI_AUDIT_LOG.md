# UI Audit Log

Newest first. One line per finding: severity · what · fix.

## 2026-06-11 — Full interactive audit (all tabs, modals, mobile)

### Functional bugs
- **P0 · CSV import parsed 0 rows for every US-format date** (incl. the app's own placeholder example): `new Date("06/09/2026T12:00:00")` is invalid. Fixed: explicit ISO / m-d-y / 2-digit-year parsing with `-` `/` `.` separators.
- **P1 · CSV import turned deposits into expenses** (`Math.abs` on +500 PAYCHECK). Fixed: in signed exports, positives are skipped; all-positive files treated as debit-only.
- **P1 · Recharts Area selected-month dot always clay** even when balance positive (`p.value` is an array for areas). Fixed: read `p.payload.balance`.
- **P2 · Logo picker modal was unreachable dead code** (no trigger; pre-rebrand WCM logos; external img URL breaks offline PWA). Removed.

### UX / states
- **P1 · Silent-failure submits** — Confirm deposit, Add goal, Add subscription, Add category (×2) did nothing on click with empty fields. All now disabled-until-valid (matches Add entry pattern).
- **P1 · CSV column-detection error used native `alert()`**; 0-row parse showed "0 transactions found — review categories…" + "Import 0 entries". Both replaced with inline `role="alert"` guidance.
- **P2 · Renewal dialog date empty** — now prefilled with next cycle date from cycle length.
- **P2 · "← Current week" back-nav styled as danger** → neutral cream ghost, relabelled "← Back to current week".

### Consistency / visual
- **P1 · Rounding inconsistency in money app**: entry $42.50 vs tile "$43" vs "Week total $43". Actual money now uses `fmtA`/`fmtSA` (exact cents) in tiles, week total, entries, CSV review.
- **P1 · Danger hue used as selection**: year pills, week-picker current row. Now cream selection (matches active tab). Rule added to DESIGN_SYSTEM.
- **P1 · White-on-color filled buttons remained** in CSV modal + renewal dialog (missed by prior sweep). Now teal/clay + dark `C.bg` text.
- **P2 · Aid year-card accent was clay on all years** (decorative). Now teal if monthly surplus ≥0, clay if deficit — matches the card's own pill.
- **P2 · Aid card header overflow**: remove-✕ poked outside card at narrow widths → header rows wrap.
- **P2 · Mobile header**: right cluster wrapped into subtitle text → header wraps as rows.
- **P2 · Weekly entry amounts rendered in danger clay** for normal spending → cream.

### Copy
- Year pills "Aug 26 – Aug 27" read as days → "Aug '26 – Aug '27".
- "1 entries" (deposit history), "1 transactions found" (CSV) → pluralized.
- Tooltip "Total position : " stray space → `separator=": "` on all 8 Recharts tooltips.
- Key notes hardcoded stale "~$1,935/mo" → points at the live Monthly spendable tile.

### Verified working (no change needed)
Reset confirmation (Cancel-dominant, destructive ghost) · renewal banner/badge/Overdue pill pipeline · week auto-categorization (TRADER JOES→Food, MTA→Transportation) · subscription auto-reflection in budget ("incl. $15 subs") · empty states on all charts · 375px: zero horizontal overflow on all 7 tabs · COA + 5-year tables scroll within cards · CSV modal fits mobile.

### Known gaps (deliberate, see FUTURE_WORK)
Conflict modal untested live (needs a real sync conflict; code-reviewed only) · 🌙 toggle only subtly brightens (no true light theme — needs a product decision) · "Spending distribution" shows plan, not actuals (title ambiguity).

## Pre-2026-06-11 (summarized from memory)
Glass sweep all surfaces · semantic color split (was: surplus/deficit identical) · clay danger hue + steel-blue info · CHART_COLORS de-clustered · destructive modals Cancel-dominant · empty chart placeholder boxes · ✕ tap targets ≥28px · tab-bar mobile fade · InfoTip hover-intent + scale-in · date-field theming · real font weights · muted-text alpha 0.40→0.52 · progress track visibility · white-on-red primary buttons eliminated (main app) · one-click Reset wipe → confirmation · color-dot rings · mobile grid overflow fix.
