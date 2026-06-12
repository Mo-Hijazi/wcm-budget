# Component Library

Shared components in `index.html`. Reuse these — don't restyle ad hoc.

## Components
- **`Card`** — glass surface (no `accent` prop anymore — top stripes read as glitches; state lives in the figures/pills inside).
- **`MetricTile`** — label (10px caps, gray) + serif value + sub. Value color carries semantics (teal/clay/cream).
- **`Pill`** — status chip: `ok` teal, `warn` amber, default clay, `neutral` dark. Always paired with text, never color-only.
- **`Banner`** — `info` (steel-blue), `warn` (amber), `error` (clay). Dismissible via `onClose` + `dismissed` map.
- **`Modal`** — fixed overlay `rgba(0,0,0,0.65)` + blur(14px), glass panel, ✕ top-right. Widths: 340 (confirm), 360–380 (form), 680 (CSV table).
- **`TabBtn`** — active = solid cream pill + ink text; container `.tabbar` scroll-fades <600px.
- **`YrBtn`** — segmented-pill sibling of TabBtn (active = cream pill + ink); lives in a `.tabbar` glass pill; active year's date range rendered once beside the pill via `yrRangeLabel`.
- **`XBtn`** — the ONLY ✕ affordance: ghost circle (no border/fill until hover), `label` required, `danger` prop for clay. Never hand-roll a boxed ✕.
- **`MonthPicker`** — glass popover month grid replacing native month `<select>`s (selection = `sel`/`selBg`, never a semantic hue).
- **`CatIconPicker`** + `CAT_ICON_CHOICES` (20 ring-language icons) — collapsed behind an icon-preview button in add flows; existing category icons editable via popover in Categories tab (`editIconCat`).
- **Settings menu** — header gear → glass popover (`menu-row` hover class): theme toggle, Reset defaults (clay). New "app-level" actions belong here, not as loose header buttons.
- **`ProgressBar`** — track `rgba(255,255,255,0.16)`, animated width .4s.
- **`InfoTip`** — 140ms hover-intent, `tipIn` scale/fade, transform-origin bottom center.
- **`RenewalDialog`** — two-step (renewed? → price/date), prefills next cycle date.
- **`BrandIcon`** — subscription service icon with brand color fallback.

## Form-control vocabulary
- Inputs/selects/textarea/date: `C.bg` fill, `C.border` hairline, 8px radius, cream text, focus glow `3px rgba(98,181,138,0.28)`; no native spinners/carets/calendar chrome.
- **Every submit button is disabled-until-valid**: `C.surface` bg + `C.gray` text + `not-allowed` cursor when invalid; filled `C.teal` + `C.bg` text when valid.
- Destructive confirms: Cancel is the dominant filled button; destructive is a clay ghost.
- Delete ✕ buttons: ≥26×26px, `aria-label` required.

## Button state matrix (required on anything interactive)
default · hover (subtle bg lift) · keyboard focus (2px teal outline, global CSS) · disabled (surface/gray/not-allowed) · destructive (clay family only)
