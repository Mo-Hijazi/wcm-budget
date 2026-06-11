# Component Library

Shared components in `index.html`. Reuse these — don't restyle ad hoc.

## Components
- **`Card`** — glass surface. `accent` prop = 3px top border, must encode state (teal surplus / clay deficit), never decoration.
- **`MetricTile`** — label (10px caps, gray) + serif value + sub. Value color carries semantics (teal/clay/cream).
- **`Pill`** — status chip: `ok` teal, `warn` amber, default clay, `neutral` dark. Always paired with text, never color-only.
- **`Banner`** — `info` (steel-blue), `warn` (amber), `error` (clay). Dismissible via `onClose` + `dismissed` map.
- **`Modal`** — fixed overlay `rgba(0,0,0,0.65)` + blur(14px), glass panel, ✕ top-right. Widths: 340 (confirm), 360–380 (form), 680 (CSV table).
- **`TabBtn`** — active = solid cream pill + ink text; container `.tabbar` scroll-fades <600px.
- **`YrBtn`** — cream selection treatment (see DESIGN_SYSTEM rule 1) + 2-line date sublabel.
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
