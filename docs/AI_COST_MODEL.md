# Marro — AI Cost Model

Plain-language reference for what the Phase-4 AI features cost, how to keep them cheap, and how to not get burned. Pairs with `STRATEGY.md` §1–2/§4 (vision + monetization), `docs/DATA_ETHICS.md` (privacy/data rules), and the `project-marro-ai-cost` memory (which now just points here).

> **Everything here is an estimate until measured.** The numbers are built on reasonable assumptions about prompt sizes and usage, and could be off 2–3× in either direction. **The first task of Phase 4a is to turn the AI on for a handful of real users and measure actual cost — then trust real data, not this doc.** (Captured June 2026.)

---

## TL;DR
- You pay the AI **by the word** (input + output; output costs ~5× input). Keep prompts summarized and answers short.
- **Most work is tiny, cheap tasks** (fractions of a penny) → run on **Haiku**. Reserve the expensive model (**Opus**) for rare, high-stakes reasoning (loan advice).
- A typical active user costs **~$0.15–0.40/month**; even a heavy user is **under ~$0.55/month**.
- At a future $5/mo price, AI is **~6% of revenue** — payment-processing fees actually cost more. AI is not the financial risk.
- The real risk is a **runaway bill** (a bug loop or abuse). Hard spending cap + alerts + per-user limits go in **before** any AI ships — non-negotiable.

---

## 1. How AI pricing works (plain)
Each time the app asks the AI to do something, that's one **call** (like one message to an assistant). You pay for the text:
- **Input** = the question + the context we send in.
- **Output** = the answer that comes back. **Output costs ~5× more than input**, so short answers matter most.

Billing is by **token** (~¾ of a word). You don't track tokens by hand — just remember: **more text = more money.** Most of using Marro (logging expenses, charts, the math) never touches the AI and is free to run; only the smart features cost anything.

## 2. The three model tiers + the routing rule
Like hiring help at three pay grades — use the cheap one for almost everything, the expert only when it's worth it. Prices below are **as of June 2026 and will change**; keep the model choice in one config so it's swappable.

| Tier | Price (in / out per 1M tokens) | Use it for | Volume |
|---|---|---|---|
| **Haiku** (4.5) | $1 / $5 | Anomaly checks, categorization, receipt reading, voice-entry parsing, simple nudges, habit recognition | **High** |
| **Sonnet** (4.6) | $3 / $15 | Weekly digest, aid-letter parsing, multi-factor nudges — readable prose / multi-source synthesis | Medium |
| **Opus** (4.8) | $5 / $25 | Loan advice ("should you take Grad PLUS?"), repayment strategy, true-cost reframing, hard free-text questions | **Low** |

**Routing rule:** *default to Haiku → escalate to Sonnet when the output is user-facing prose or needs synthesis across several data points → escalate to Opus only when a wrong answer is financially harmful or needs genuine multi-step reasoning.*

Mental model: **Haiku reads and sorts · Sonnet writes and explains · Opus reasons and advises.** The Opus advice is what people pay for, so it's fine that it's the expensive one — it's rare and high-value.

Two model knobs to keep in mind:
- **"Thinking" / heavy reasoning multiplies output cost.** Keep it **off** for the simple tasks; only the rare deep-advice questions need it.
- **The app already does the math** (projected balances, goal/Step progress, savings — built in Phase 2). The AI's job is usually just to **narrate a number we already have**, which is cheap. We don't pay the AI to calculate; we pay it to talk.

## 3. Cost per feature
Assuming the discipline below (send summaries, short answers):

| Action | Model | ~Cost/call |
|---|---|---|
| Anomaly check ("is this unusual?") | Haiku | $0.0016 |
| Expense categorization | Haiku | $0.0009 |
| Receipt scan (extract amount/date/merchant) | Haiku | $0.0025 |
| Voice spend entry (phone does speech→text free + Haiku parse) | Haiku | ~$0.001 |
| Goal / Step / savings explainer (narrate a number the app computed) | Haiku | ~$0.0015 |
| Weekly digest (synthesized; can bundle habits+goals+savings in one call) | Sonnet | $0.017 |
| Aid-letter scan (complex doc) | Sonnet | $0.017 |
| Loan-aware advice / hard question | Opus | $0.040 |

Notes that keep these low:
- **Voice is cheap because the phone listens for free** — use built-in OS dictation (speech→text), then a tiny Haiku call to structure it. Don't pay a transcription service. (Claude models don't take raw audio directly; the OS handles step 1.)
- **Bundle analyses** — one weekly digest call can cover habits + goals + savings instead of three separate calls.
- **Avoid back-and-forth chat** — each new turn re-sends the whole conversation, so a chatty exchange costs 5–10× a clean one-shot entry. Design entry/analysis as one-and-done.
- **Shrink images before sending** — receipt/aid-letter photos are the one place text-saving tricks don't apply; a big phone photo costs much more than a downscaled one for no benefit.

## 4. Cost per user / at scale
Typical active user, budget-only AI (Phase 4a): ~30 anomaly checks + 4 digests + 10 receipts + a few nudges ≈ **$0.15/mo**. Adding voice + goals/savings/loan advice:

| User type | ~Monthly |
|---|---|
| Light | ~$0.15 |
| Typical (4a + occasional advice) | ~$0.30 |
| Heavy (power user, many receipts + loan questions) | ~$0.55 |

If **every** user were active (worst case — reality is lower), at a ~$0.30 blended rate:

| Users | ~AI bill/mo |
|---|---|
| 100 | ~$30 |
| 1,000 | ~$300 |
| 10,000 | ~$3,000 |
| 50,000 | ~$15,000 |

Margin check (long-term paid model): at $5/mo, even a heavy user's ~$0.55 AI cost is **~6% of revenue**. **Payment-processing fees (Stripe ~3% + $0.30 ≈ $0.45 on a $5 charge) cost more than the AI** — and on the $0.99 first month the processor's cut (~$0.33) eats most of it, so treat the 99¢ month as a conversion tool, not profit. AI is not the cost risk; acquisition and payment fees are bigger lines.

## 5. Monetization & the free tier (staged)
See `STRATEGY.md` §4 for the full monetization stance. Two stages:

- **Stage 1 — Free for everyone (early).** No paid tier yet; grow and prove value. Here cost discipline matters **most** (no revenue backstop — every penny is out of pocket), but absolute dollars are small because the user base is small. Lean on cheap routing + startup credits + the safeguards. Be **generous with the cheap everyday AI**, keep a **cap on the expensive Opus advice** so no single free user burns a lot.
- **Stage 2 — All-paid (long-term).** Everyone pays: **2-week free trial → $0.99 first month → ~$5/month.** No permanent free tier. The free-rider problem disappears; margins get healthy.

This supersedes the earlier "permanent free tier with bounded AI forever" framing — the long-term model is **all-paid**, not free+paid. The free trial is the only ongoing free-AI exposure, and it's time-limited, which also bounds abuse risk.

**Transition care:** when the paywall turns on, **grandfather early adopters** (free/discounted forever) and communicate well ahead — the rug-pull feeling is a real trust risk for skeptical med students. (Already a `STRATEGY.md` §4 commitment.)

**Open tension (not decided here):** a hard paywall can slow the **per-school user density** that Phase-6 benchmarking needs (~10+ users/school). The trial may cover it; revisit whether some limited free slice exists *for benchmarking density*, separate from the AI question, when Phase 6 nears.

## 6. Cost-control levers (ranked by impact)
1. **Send summaries, not raw data** — pre-compute totals/patterns before the call. Biggest lever (cuts 5–10× per request).
2. **Batch API = 50% off on anything not urgent.** Weekly digests and anomaly sweeps are background/scheduled, not interactive — run them through the batch path and halve the two biggest cost lines. Marro is unusually batch-friendly because so much AI is triggered/scheduled.
3. **Prompt caching** — cache the stable system prompt + the user's context; cached reads cost ~0.1×. Helps most when several calls fire close together.
4. **Model routing** — Haiku by default (§2).
5. **Cache when nothing changed** — no new expenses since last digest → resend the stored digest, zero cost.
6. **Shrink images** before sending (§3).
7. **Free-tier caps + BYOK** — limit free/trial users' *expensive* actions; let power users bring their own key.

## 7. Safeguards — prerequisites before ANY AI ships (non-negotiable)
The only thing that can genuinely hurt a self-funded founder is a runaway bill from a bug loop or abuse. These go in **before** the first AI feature, treated like a launch-blocker (the way accessibility is):
- **Hard spending cap** on the AI account ("stop at $X/month") — a setting, day one.
- **Billing alerts** at low thresholds ($50/$100/$200) so a spike is caught in an hour, not at month-end.
- **Per-user rate limits** (e.g. N actions/minute, M/day) — stops both the bug loop and the abuser. Most critical during the free/trial phase, where there's no revenue backstop.

## 8. Quality & reliability (not just cost)
- **Watch quality, not only cost.** Add a simple **"was this helpful?" thumbs up/down** on AI responses and **periodically eyeball the advice outputs** (especially loan advice). A confidently-wrong answer is worse than an expensive one for a trust-first med-student product. The same signal tells the model-switching system when a model has drifted.
- **The AI must be allowed to fail without breaking the app.** Marro is a budget app first; AI is a layer on top. If a call errors/times out/is down, core budgeting keeps working perfectly and the user sees a calm "couldn't analyze right now" — never a broken screen. (Also an accessibility/trust point, and a small cost lever: failed calls that get retried bill twice.)
- **Don't cheap out where wrong = harmful.** Save aggressively on low-stakes tasks; pay for the good model on money advice. The expensive calls are rare, so this barely moves the bill.

## 9. Model swapping (modular, human-approved)
Keep all "which task → which model" choices in **one config (a routing table)** so a swap is a one-line change. Switching is **auto-detect + human-approve**: the dashboard *flags* when to reconsider (a new cheaper model, a cost spike on a feature, a quality dip), and a human **tests then approves** the switch — **never auto-swap the high-stakes advice route without a test.** Low-stakes routes (categorization, receipts) could auto-switch later once trusted. A fully self-driving model-picker is premature now.

## 10. Privacy (must match `privacy.html` and `DATA_ETHICS.md`)
- Only **summaries** of the user's data are sent to the AI provider, never raw dumps where avoidable.
- The provider must **not train on user data** (Anthropic's API is no-train-by-default — a reason to stay first-party for now over cheaper third-party hosts whose data policies vary). Re-vet any provider's data policy before routing financial data to it.
- Disclose the sub-processor (Anthropic) and "summaries sent to a third-party AI provider" in `privacy.html`; account deletion wipes AI tables too. See `STRATEGY.md` §6 and `DATA_ETHICS.md`.

## 11. Operational dashboard
Per `STRATEGY.md` §2, the early admin/observability dashboard must track AI **spend broken down by feature and by user** (not one total) **and** the quality signal (§8). You can't manage what you can't see, and per-feature/per-user breakdown is what makes "measure before you trust" (the TL;DR rule) possible and pinpoints spikes instantly.

---

## Decision summary (logged 2026-06-29)
- **Routing:** Haiku default → Sonnet for prose/synthesis → Opus for high-stakes reasoning.
- **Pricing:** free-for-everyone first → long-term all-paid via **2-wk trial → $0.99 first month → ~$5/mo** (no permanent free tier; supersedes the old free+paid framing). Grandfather early adopters.
- **Safeguards** (cap, alerts, per-user limits) are AI-launch prerequisites.
- **Startup credits:** apply when flipping on Phase 4a (so the clock starts with usage), not before.
- **Model switching:** modular config + auto-detect/human-approve; never auto-swap advice route untested.
- **Also:** shrink images; bundle analyses; one-shot (not chatty) entry; quality monitoring + graceful failure; don't cheap out on advice; measure real usage before trusting any number here.

**Still open (defer to Phase 4a start):** final free/trial caps, exact per-user rate limits, usage-pool size + reset, BYOK transport, anomaly sensitivity, benchmarking-density vs paywall tension.
