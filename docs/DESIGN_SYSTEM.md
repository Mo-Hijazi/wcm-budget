# Marro Design System

Single source of truth for visual decisions. Code lives in `index.html`: `const THEMES = ` (JS tokens, both themes), the `:root` / `[data-theme="light"]` CSS variable blocks, and `const ICONS` (icon paths).

## Concept
Neutral warm canvas under liquid glass — near-black dark theme, warm off-white light theme — with the growth-rings motif, marigold, and serif numerals carrying the brand. The green "candlelight" identity was retired June 2026 (colorblind-safety + scaling). Hero details: **serif numerals (Newsreader) for display money** and **ring-derived iconography**.

## Theme mechanism (hybrid — keep both halves in sync)
- `const C = {...THEMES.dark}` feeds ~400 inline style refs. `applyTheme(dark)` does `Object.assign(C, THEMES[t])`, swaps `CHART_COLORS` in place, sets `<html data-theme>`, updates the `theme-color` meta. A `themeTick` state forces the post-swap render.
- The `<style>` block consumes ~30 CSS custom properties (`--bg`, blobs, glass, inputs, focus). `[data-theme="light"]` overrides them. **Any token used in both worlds must be edited in both places.**
- Persisted in `data.darkMode` (synced). A pre-paint script in `<head>` prevents theme flash. Legacy states were migrated to dark once (`wcm_theme_v2` localStorage marker); fresh users follow `prefers-color-scheme`.

## Color tokens (C object)
| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#101210` | `#F5F4EF` | App bg; also text on filled buttons |
| `text` | `#F6EFDD` cream | `#26251E` ink | Primary text |
| `gray` | cream @ .52 | ink @ .55 | Muted text (min legible alpha per theme) |
| `teal`/`green` (pos) | `#82AEDB` blue | `#33689E` | Positive, surplus, additive actions |
| `neg` | `#E5A23E` amber | `#9C6A00` | **Negative data only**: over-budget, deficits, actual-vs-plan series |
| `danger` | `#E08A6B` clay | `#B05A38` | **Destructive only**: delete, reset, errors. Never data |
| `blue` (info) | `#9FB0BC` slate | `#5C7282` | Info banners/chips |
| `amber`/`marigold` | `#DDA528` | `#A87B12` | Wins, milestones, brand dot. Never general chrome |
| `sel` / `selBg` | cream .75 / .14 | ink .55 / .08 | Selection/active states |
| `scrim` | black .65 | ink .35 | Modal overlays |

Each semantic hue has `*Light` (tint bg) and `*Mid` (border) variants, re-derived per theme (alphas composite differently on white — never mirror them).

### Semantic rules (hard-won — do not regress)
1. **Selection ≠ danger ≠ negative.** Active/selected = `sel`/`selBg` (cream on dark, ink on light). Drag targets too.
2. **Blue vs amber is the data pair** — chosen to be distinguishable under deuteranopia/protanopia. Color is never the only signal: always pair with +/− signs, labels, or chips.
3. **Clay is destructive-affordance only** (filled for low-stakes removes, ghost in confirmations) — it must never mark data.
4. **Filled buttons use dark text** (`C.bg`), never `#fff`.
5. Disabled = `C.surface` bg + `C.gray` text + `cursor:not-allowed`. Every submit is disabled-until-valid.

## Charts
`CHART_COLORS` is theme-swapped in place; both palettes keep the "no adjacent hue families" order; light's cream slot becomes ink. All Recharts `<Tooltip>` use `{...tipProps()}` — a *function* (C mutates on theme swap; never capture its values in module-level constants). Area-chart `dot` renderers must read `p.payload.<key>`.

## Icons (`Icon` component)
Ring-derived line icons: 20×20 grid, stroke 1.4, round caps/joins, `currentColor`. The marigold dot appears only on `savings` and `live`. Category icons render in rows tinted with the category's chart color; unknown (custom) categories fall back to a plain ring. Exception: `BRANDS` letter-tiles keep their glyphs (third-party content, not UI chrome). `RingProgress` (circular, marigold dot at 100%) is for goals; budget/weekly bars stay linear.

## Money formatting
- `fmt` — whole dollars, plans/budgets only
- `fmtA` / `fmtSA` — actual money: shows cents when present, never rounds real transactions
- `fmtD` — always 2 decimals
- Newsreader (serif) on display money ≥ ~16px (MetricTile values, balance figures); small inline amounts stay Inter.

## Typography
Inter + Newsreader **variable woff2, self-hosted in `/fonts`** (SIL OFL, license alongside). No external font requests — required for the offline PWA. `font-display: swap`, preloaded in `<head>`.

## Glass system — 3 tiers only
| Tier | Recipe | Used by |
|---|---|---|
| G1 `.mc` | blur(40px) sat(180%), `--glass-card`, r22 | Cards, MetricTile, tab bar (r32 pill exception) |
| G2 `.mm` | blur(50px) sat(200%), `--glass-modal`, r16 | Modals, dropdowns |
| G3 inline | blur(20px), tint or `C.glassTooltip`, r12 | Banners, tooltips, InfoTip, sticky headers, goal tiles |

Scrims stay blur(14px) + `C.scrim`. Shadows are themed (`--shadow-card`, `--shadow-card-hover`, `--shadow-modal`). Radius scale: **8 / 12 / 16 / 22 / pill** (3–4 allowed for micro swatches). View glass via server only — `backdrop-filter` breaks on `file://`.

## Layout
- Page-level grids: `repeat(auto-fit, minmax(min(100%,300px),1fr))` — never hard `1fr 1fr`
- Card header rows that hold pills/buttons: `flexWrap:"wrap"`
- Scrollable tables get `className="scrollx"` (right-edge fade < 600px, like `.tabbar`)

## UX copy
- Sentence case; em-dash asides; second person ("your grant")
- **No school-specific copy** — the app is school-agnostic in all visible text (user's own data like housing notes is fine)
- Pluralize all counts; year ranges `Aug '26 – Aug '27`
- Empty states use `<EmptyState>` (ring watermark + teach copy)
- Errors: inline `role="alert"` boxes (clay tint), never `alert()`
- Modals: `Modal` provides `role="dialog"`, focus trap, Esc-to-close — don't hand-roll overlays
