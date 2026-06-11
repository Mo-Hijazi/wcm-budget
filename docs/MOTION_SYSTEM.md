# Motion System

Motion conveys state, never decoration (product register). 150–250ms, ease-out. No page-load choreography.

## Inventory
- Ambient blobs: 4 divs, blur(34px), 15–21s ease-in-out cycles. Budget-health signal: calm greens (on track) / low-tide `#7C8471` (over) / marigold bloom (milestone). Transitions are slow color interpolation.
- Logo rings: slow ping-pong scale.
- `tipIn` (InfoTip): scale+fade, origin bottom-center, after 140ms hover intent.
- ProgressBar width: .4s.
- Buttons/tabs: `all .15s`.
- Sync pulse: `wcmpulse` 1s on the syncing dot.

## Rules
- Animate transform/opacity (+ width on progress bars only). No layout-property animation.
- New keyframes need a `@media (prefers-reduced-motion: reduce)` fallback (crossfade or none). **Gap: blobs currently lack one — see FUTURE_WORK.**
- Modals: appear instantly (no entrance choreography); overlay blur is static.
- Charts: Recharts default entrance is acceptable; don't add more.
