# UI Audit Log

Newest first. One line per finding: severity · what · fix.

## 2026-06-11 (fourth pass) — User feedback round 3 (8 items)

- **P1 · Native date-picker calendar popup can't be themed** → custom `DateField` (glass day grid, Monday-start, marigold today, "Today" shortcut) replaced all 9 native date inputs; dead `::-webkit-calendar-picker` CSS removed.
- **P1 · Tooltip trailed the cursor** → `isAnimationActive:false` in `tipProps()` (Recharts animates tooltip position 400ms by default).
- **P2 · Comparison still used native selects** → `PeriodPicker` glass popover (year pills + full-year + month grid).
- **P2 · Picker popovers painted under the next card** (cards are stacking contexts) → `useLiftCard` bumps the hosting card to z-50 while open. (First tried fixed-position anchoring — flaky under layout shift; reverted.)
- **P2 · Aid-card ✕ wrapped down beside the surplus pill** → pinned absolute top-right; XBtn default 28px / 14px icon (was 26/12).
- **P2 · Category icon chips too small/thin** → 26→30px chip, stroke 1.6→1.9, stronger tint.
- **P2 · "This week — Jun 8 – Jun 14" read as plain text** → caps whisper label + 20px serif date range (matches display-money language).
- **P3 · Flicker at top when scrolled to bottom** → blob layer pinned to its own compositor layer (`translateZ(0)` + `backface-visibility:hidden`).
- **Note**: "gray bar on hover" + "title confusion" on the live site were a stale deploy — the previous two passes were committed/pushed at the start of this round.

Verified: DateField popover + day selection (Weekly), PeriodPicker open/clamp/selection over sibling cards, week header, no console errors.

## 2026-06-11 (third pass) — User feedback round 2 (11 items)

- **P1 · Boot was a bare "Loading…" line** → full boot moment: staggered ring bloom, orbiting marigold dot, serif "Marro." fade-up; pure CSS so it runs before React/Babel; reduced-motion safe.
- **P1 · Bar-chart hover still showed a cursor box** → `cursor={false}` on all three bar charts; hovered month's bars stay full while siblings dim to 0.35 (`barHover`/`barDim`/`barMove`, same language as the donut).
- **P2 · Category icons frozen after creation** → click the icon chip in Categories tab → glass popover picker; saved to `cat.icon`.
- **P2 · Only 12 icon choices** → +10 new ring-language icons (coffee, health, fitness, travel, phone, music, gift, paw, shirt, game) = 20.
- **P2 · Icon grid always expanded in add flows** → collapsed behind a 36px icon-preview button beside the name field.
- **P2 · Aid year date inputs were a cramped one-off** (10px font / 2px padding) → standard field recipe (12px / 5px 8px) + row wraps.
- **P2 · Boxed ✕ buttons everywhere** → shared `XBtn` ghost circle (modal close, remove category, delete entry, undo deposit, delete goal [danger], remove year).
- **P2 · Calendar picker icon too dim in dark** → filter brightness 1.05→1.25, base opacity 0.5→0.75.
- **P2 · Native month `<select>` clashed with the glass UI** → shared `MonthPicker` popover grid (Monthly plan header).
- **P2 · Header cluttered with loose theme/reset buttons** → settings gear menu (theme toggle, clay Reset defaults).
- **P2 · "Monthly spendable vs budget — all years" title contradicted its year x-axis** → "Spendable vs budget by year" + explanatory sub; legend now "/mo"-suffixed.
- **P3 · EmptyState watermark still read as a misprint** → small crisp 34px ring mark above the copy, watermark removed.
- **P3 · Savings deposit log showed raw ISO dates** → `fmtDay`.

Verified: boot screen, settings menu, month grid, icon-edit popover, 20-icon set, aid dates, ghost ✕s, bar dim (cells render; donut re-verified — note: Recharts pie paints nothing while the tab is `visibilityState:hidden` (rAF paused), an environment artifact, not a bug). Zero console errors.

## 2026-06-11 (later) — User feedback polish pass (12 items)

- **P1 · Form controls rendered in system font, not Inter** (browsers don't inherit font into inputs) → `input, select, textarea, button { font-family: inherit }` incl. `::-webkit-datetime-edit`.
- **P1 · Light mode glare**: bg `#F5F4EF`→`#ECEAE2`, card glass white 0.55→0.42, `brightness(1.08)` dropped in light via `[data-theme="light"] .mc/.mm` overrides, light blobs deepened. (CSS vars + THEMES.light kept in sync.)
- **P1 · Bar-chart hover showed stock bright-grey cursor rect** → `tipProps()` now sets `cursor:{fill:C.selBg,stroke:C.borderDark}` everywhere.
- **P2 · Ambient blobs too subtle to register** → chroma + opacity raised both themes (dark 0.6→0.78, light 0.55→0.72); blob2 is now a deliberate slate-blue whisper; calm/low-tide/bloom states preserved.
- **P2 · Custom categories stuck with generic ring icon** → `CatIconPicker` (12 ring-set choices) in both add-category flows; stored as `cat.icon`, rendered via `cat.icon||cat.id`.
- **P2 · Card top accent bars (teal/amber) read as a rendering bug** → removed `accent` prop from Card + both call sites (Running balance, aid year cards); the colored figures already carry the signal.
- **P2 · Donut tooltip felt blocky** → removed; hover detail now lives in the donut center (name, serif amount, % of plan), non-hovered slices dim to 0.35, legend rows hover-link to slices.
- **P2 · EmptyState ring watermark clipped** by container height → 120px→86px + taller padding.
- **P2 · Year selector cluttered** (date range repeated under every button) → segmented glass pill (tab-bar language); active year's range shown once beside it.
- **P2 · Tab bar stretched full-width leaving dead space** → `width:fit-content`.
- **P2 · Wordmark whispered** → 17px→24px Newsreader w600 + marigold full stop ("Marro.").
- **P3 · Entries list showed raw ISO dates** → `fmtDay()` ("Jun 11").
- **P3 · Charts felt stiff/finance-y** → bar `radius [6,6,0,0]` + `maxBarSize 26`, donut `cornerRadius 5` + `paddingAngle 2.5`, area strokes 2→2.5.

Verified: dark + light, Budget/Weekly/Charts tabs, add-category modal, 375px (no overflow; year pill gets tab-bar edge fade), zero console errors.

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
