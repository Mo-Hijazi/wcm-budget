# Data Model & Sync

State schema, linkage system, and sync architecture. Read before touching data logic, and **always** read the linkage section before editing savings/weekly/entry code.

## State shape (`DEFAULT_STATE`, localStorage `wcm_v8`)
```
categories        [{id, label, locked?, autoCalc?}]
years             [{id, label, type, grant, tuitionFees, healthIns, otherIncome,
                    housing, housingNote, wcmLivingAllowance, notes, startDate,
                    endDate, monthly:{catId→amount}, monthlyOverrides:{monthName→{catId→amount}}}]
weeklyArchive     [{weekStart, weekEnd, entries:[{id,catId,amount,note,date,depositId?}], total}]
currentWeekEntries [{id,catId,amount,note,date,depositId?}]
subscriptions     [{id,name,amount,cycle,renewal,active}]
monthlyRollover   {yyyy-mm: amount}
surplusBank       number
monthDisabled     {"ay-MonthName": [catIds]}
darkMode          bool
stepGoals / savingsGoals  [{id,label,targetAmount,targetDate,saved,monthlyContribution}]
savingsLog        [{id,goalId,amount,date,note,weeklyEntryId?,budgetAdded?}]
_savedAt          number (timestamp on every save — drives 3-way merge)
```

### savingsLog entry (key to linkage)
- `weeklyEntryId` — `"e_<ts>"` linked weekly entry (if auto-created)
- `budgetAdded` — `{ay, monthName, catId, amount} | null` — budget delta auto-added

## Year configs (`YEAR_CONFIGS`, index === y.id)
| idx | Label | Start | End | Grant | Tuition | Housing |
|---|---|---|---|---|---|---|
| 0 | Year 1 2026-27 | 2026-08-01 | 2027-08-15 | $109,848 | $76,648 | $996 Olin Hall |
| 1 | Year 2 2027-28 | 2027-08-01 | 2028-08-15 | $109,848 | $76,648 | $1,370 Lasdon |
| 2 | Year 3 2028-29 | 2028-08-01 | 2029-08-15 | — | — | — |
| 3 | Year 4 2029-30 | 2029-08-01 | 2030-08-15 | — | — | — |
| 4 | Extended 2030-31 | 2030-08-01 | 2031-06-30 | $0 | $5,232 (waived) | — |

Default monthly budgets (`DEFAULT_MONTHLY`): Y1 housing $996, food $380, transport $110, personal $150, books $80, exams $0, savings $150, social $80. Y2: exams $50, savings $100, housing $1,370. Y3: exams $150, savings $0. Y4: exams $100. Y5(ext): exams $50.

## Academic calendar
```js
MONTH_NAMES = ["Aug",...,"Jul"]   // index 0=Aug, 11=Jul
// calendar month → academic index: (calMonth - 7 + 12) % 12
// monthKey format: "ay-MonthName" e.g. "0-Aug"
```

## Key computed values (in render)
```js
yr          = data.years[ay]
moSpendable = (annGrant - tuition - healthIns + otherIncome*12) / 12
moSurplus   = moSpendable - moSpend - unbudgetedTotal   // rounded
weeklyBudget= moSpendable / 4.333 (+ last week's rollover)
```

---

## ⚡ Savings ↔ Weekly ↔ Budget linkage (CRITICAL)

### How money flows
1. **"Log deposit" (Savings tab)** → creates savingsLog entry + weekly entry (catId=`exams` for Step, `savings` for custom) + increments `goal.saved`. If base `monthly[catId]===0`, auto-manages `monthlyOverrides` (below).
2. **Weekly "exams" entry** → credits first unfunded Step goal, overflowing to the next once full. One weekly entry can create multiple savingsLog rows. The budget line is NOT credited — it's a plan only.
3. **Budget line (`monthly.exams`)** → drives the Savings-tab callout. Never auto-credits `saved`. (Deliberate UX decision, June 2026 — weekly entries and Log deposit are the only things that move real money.)

### Auto-managed budget override (deposit → budget tab)
- Only when `monthly[catId] === 0` (no manual base budget)
- Create: `override += depositAmt` (increments — handles multiple deposits/month)
- Delete: `override -= budgetAdded.amount`, floor 0; delete key at 0
- Manual base budget > 0 → `budgetAdded = null`, override untouched

### Helpers (grep these)
| Function | Does |
|---|---|
| `removeWeeklyEntry(d, eid)` | Removes entry from currentWeekEntries + all archives |
| `reverseDeposit(d, slEntry)` | Removes weekly entry, decrements goal.saved + override, removes savingsLog row |
| `reverseDepositGroup(d, slEntry)` | Reverses all savingsLog rows sharing `weeklyEntryId` (overflow splits) |

### Delete paths
- Savings tab × → savingsLog by `entry.id` → `reverseDepositGroup`
- Weekly tab × → savingsLog rows by `weeklyEntryId === eid` → reverse all; none found → plain delete

### USMLE callout (Savings tab)
Shows when `yr.monthly.exams > 0` AND any Step goal has `saved < targetAmount && !monthlyContribution`. Apply sets `monthlyContribution` (projection only); callout then hides.

---

## Auth + Sync architecture (CRITICAL — read before touching sync)

### Auth (Phase 2.5b)
- supabase-js v2 UMD via CDN; client `const sb` (the UMD global is `supabase` — don't shadow it). URL + **publishable** key hardcoded in `index.html` (safe; RLS-gated). PKCE flow.
- Hard login gate. `session` state: `undefined`=restoring → Loading; `null`=signed out → `LoginScreen`; object → app. `getSession()` on boot + `onAuthStateChange`; `SIGNED_OUT` clears `wcm_v8`/`wcm_v8_base`/`wcm_uid`.
- `applyTheme(dataset!=="light")` runs at module load so pre-login screens (LoginScreen) theme correctly before app data loads.

### Supabase tables (RLS: each user reads/writes only their own row, `auth.uid() = user_id`)
- `app_state(user_id uuid PK, state jsonb, updated_at)` — the whole state blob, one row/user.
- `profiles(user_id uuid PK, school text, created_at)` — null/empty school → first-run `OnboardingFlow` (welcome → name → avatar → school; saves name+avatar into `app_state.state`, school into `profiles`). School-only re-edit from Settings reuses `ProfileModal` (dismissable). Picker (shared by both) searches `US_MED_SCHOOLS` (full Wikipedia MD+DO list; entries are `{name}` or `{name, campuses:[...]}`); multi-campus schools add a campus step, stored as `"Name — Campus"`; free-text Other. Save uses explicit `update().eq("user_id").select()` then `insert` if no row (upsert was a silent no-op).
- **Identity fields in `state` (not the DB):** `preferredName` (string|null — the name used in the header greeting + settings) and `avatar` (`{type:"google",url}` | `{type:"monogram",color:<C-token key>}` | null). Set during `OnboardingFlow`; `preferredName` is also inline-editable in the Settings menu. Rendered everywhere via the `Avatar` component (Google photo / `RingMonogram` / initial-chip fallback). Header greeting picks from a daily-rotating message pool (brand voice, name-aware).

### Storage keys (localStorage = offline cache + merge ancestor; Supabase = source of truth)
| Key | Purpose |
|---|---|
| `wcm_v8` | Current local state (cache) |
| `wcm_v8_base` | Last synced state (3-way-merge ancestor) |
| `wcm_uid` | Last signed-in user id (shared-device guard: clears cache if a different user signs in) |

### Flow
- Every save stamps `_savedAt` (the merge clock, inside the blob). Load (gated on `session`): `stateFetch()` → server row becomes `wcm_v8` + `wcm_v8_base`. No row + online → **first-login migration**: upload local `wcm_v8`/`wcm_v7` (or DEFAULT_STATE) via `stateWrite`. Offline → local cache, `syncStatus:"offline"`.
- On save (debounced 2s): fetch server, compare `_savedAt` vs base — server not newer → write; newer without overlap → silent auto-merge; same field changed both sides → **ConflictModal**.
- `window online` → immediate save. `visibilitychange` + every 30s visible → `checkAndPull`.

### Merge engine (utility fns before App — transport-agnostic, reused unchanged from the Gist era)
`diffStates(base, cur)` → changed-key map `{b,c}` · `findConflicts(localCh, serverCh)` · `applyChanges(state, changes)` · `conflictLabel` / `fmtConflictVal` for display.

### Transport (`stateFetch` / `stateWrite`, before App)
- `stateFetch()` → `sb.from("app_state").select("state").maybeSingle()` → JSON string | null (null = no row or error/offline).
- `stateWrite(json)` → upsert `{user_id, state}` → boolean. Same string-in/string-out contract the old `gistFetch`/`gistWrite` had, so `save`/`checkAndPull`/`resolveConflict` only needed a name swap. (Old `api/sync.js` Gist proxy deleted.)

### Service worker (`sw.js`)
Cache `wcm-budget-v8`. Never caches `index.html` (navigations always network) — OAuth redirects safe. Caches `/manifest.json`, `/icon.svg`, fonts; network-first/cache-fallback otherwise (covers the supabase-js CDN script for offline). Registration: `updateViaCache:'none'`, `reg.update()` on load, auto-reload on `controllerchange`.
