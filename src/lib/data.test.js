import { describe, it, expect } from 'vitest';
import {
  diffStates, findConflicts, applyChanges, fmtConflictVal, conflictLabel,
} from './data.js';

// A state that exercises every family the diff engine tracks. Kept small but
// with at least one representative of each shape so round-trips are meaningful.
const baseState = () => ({
  darkMode: false,
  logo: null,
  surplusBank: 100,
  monthlyRollover: { '0-Aug': 50 },
  monthlyDeposits: {},
  monthDisabled: {},
  coverMonths: {},
  weeklyRollover: {},
  years: [{
    grant: 1000, tuitionFees: 0, healthIns: 0, otherIncome: 0,
    housing: 0, housingNote: '', livingAllowance: 0, notes: '',
    startDate: '2024-08-01', endDate: '2025-08-15',
    monthly: { food: 300 },
    monthlyOverrides: { Sep: { food: 350 } },
  }],
  categories: [{ id: 'food', label: 'Food' }, { id: 'rent', label: 'Rent' }],
  subscriptions: [{ id: 's1', name: 'Netflix', amount: 15 }],
  stepGoals: [{ id: 'step1', label: 'Step 1', targetAmount: 850 }],
  savingsGoals: [],
  savingsLog: [],
  currentWeekEntries: [],
  weeklyArchive: [{ weekStart: '2024-01-01', entries: [{ id: 'e1', amount: 20 }] }],
});

const clone = (o) => JSON.parse(JSON.stringify(o));

// ── diffStates: detects nothing when unchanged ───────────────────────────────
describe('diffStates', () => {
  it('is empty for identical states', () => {
    const b = baseState();
    expect(diffStates(b, clone(b))).toEqual({});
  });

  it('flags a scalar edit', () => {
    const b = baseState(); const c = clone(b); c.surplusBank = 200;
    expect(diffStates(b, c)).toEqual({ surplusBank: { b: 100, c: 200 } });
  });

  it('flags nested-map additions with a dotted key', () => {
    const b = baseState(); const c = clone(b); c.monthlyRollover['0-Sep'] = 25;
    expect(diffStates(b, c)).toEqual({ 'monthlyRollover.0-Sep': { b: undefined, c: 25 } });
  });

  it('flags a year field, a monthly budget, and an override independently', () => {
    const b = baseState(); const c = clone(b);
    c.years[0].grant = 1200;
    c.years[0].monthly.food = 320;
    c.years[0].monthlyOverrides.Sep.food = 360;
    expect(diffStates(b, c)).toEqual({
      'years[0].grant': { b: 1000, c: 1200 },
      'years[0].monthly.food': { b: 300, c: 320 },
      'years[0].monthlyOverrides.Sep.food': { b: 350, c: 360 },
    });
  });

  it('keys id-arrays by item id for add and remove', () => {
    const b = baseState(); const c = clone(b);
    c.categories.push({ id: 'gym', label: 'Gym' });   // add
    c.subscriptions = [];                              // remove s1
    const d = diffStates(b, c);
    expect(d['categories[gym]']).toEqual({ b: undefined, c: { id: 'gym', label: 'Gym' } });
    expect(d['subscriptions[s1]']).toEqual({ b: { id: 's1', name: 'Netflix', amount: 15 }, c: undefined });
  });

  it('tracks weekly-archive entry edits and whole-week adds', () => {
    const b = baseState(); const c = clone(b);
    c.weeklyArchive[0].entries.push({ id: 'e2', amount: 5 });
    c.weeklyArchive.push({ weekStart: '2024-01-08', entries: [] });
    const d = diffStates(b, c);
    expect(d['weeklyArchive[2024-01-01].entries[e2]']).toEqual({ b: undefined, c: { id: 'e2', amount: 5 } });
    expect(d['weeklyArchive[2024-01-08]']).toEqual({ b: undefined, c: { weekStart: '2024-01-08', entries: [] } });
  });
});

// ── Round-trip: applyChanges(base, diff(base,cur)) reproduces cur ────────────
describe('applyChanges round-trips every diff family', () => {
  const cases = {
    'scalar edit': (c) => { c.surplusBank = 200; c.darkMode = true; },
    'nested-map add + edit': (c) => { c.monthlyRollover['0-Sep'] = 25; c.monthlyRollover['0-Aug'] = 60; },
    'year field / monthly / override': (c) => {
      c.years[0].grant = 1200; c.years[0].monthly.food = 320; c.years[0].monthlyOverrides.Sep.food = 360;
    },
    'array append': (c) => { c.categories.push({ id: 'gym', label: 'Gym' }); },
    'array item edit': (c) => { c.subscriptions[0].amount = 22; },
    'array remove': (c) => { c.stepGoals = []; },
    'weekly entry add': (c) => { c.weeklyArchive[0].entries.push({ id: 'e2', amount: 5 }); },
    'weekly entry edit': (c) => { c.weeklyArchive[0].entries[0].amount = 99; },
    'whole week add': (c) => { c.weeklyArchive.push({ weekStart: '2024-01-08', entries: [{ id: 'x', amount: 1 }] }); },
    'everything at once': (c) => {
      c.surplusBank = 999; c.monthlyRollover['0-Sep'] = 25; c.years[0].monthly.food = 400;
      c.categories.push({ id: 'gym', label: 'Gym' }); c.subscriptions = [];
      c.weeklyArchive[0].entries.push({ id: 'e2', amount: 5 });
    },
  };
  for (const [name, mutate] of Object.entries(cases)) {
    it(name, () => {
      const b = baseState(); const c = clone(b); mutate(c);
      const rebuilt = applyChanges(b, diffStates(b, c));
      expect(rebuilt).toEqual(c);
    });
  }

  it('does not mutate the input state', () => {
    const b = baseState(); const snapshot = clone(b);
    const c = clone(b); c.surplusBank = 500;
    applyChanges(b, diffStates(b, c));
    expect(b).toEqual(snapshot);
  });

  it('removing a monthly budget key deletes it rather than setting undefined', () => {
    const b = baseState(); const c = clone(b); delete c.years[0].monthly.food;
    const d = diffStates(b, c);
    expect(d).toEqual({ 'years[0].monthly.food': { b: 300, c: undefined } });
    const rebuilt = applyChanges(b, d);
    expect('food' in rebuilt.years[0].monthly).toBe(false);
  });

  it('skips changes to a year index that no longer exists', () => {
    const b = baseState();
    const rebuilt = applyChanges(b, { 'years[5].grant': { b: 0, c: 500 } });
    expect(rebuilt.years).toHaveLength(1); // no phantom year created
  });
});

// ── findConflicts: overlapping edits conflict, disjoint edits auto-merge ─────
describe('findConflicts', () => {
  it('reports a conflict when both sides changed the same key', () => {
    const b = baseState();
    const local = clone(b); local.surplusBank = 300;
    const server = clone(b); server.surplusBank = 400;
    const { conflicts, mergeLocal, mergeServer } = findConflicts(diffStates(b, local), diffStates(b, server));
    expect(conflicts).toEqual([{ key: 'surplusBank', local: 300, server: 400 }]);
    expect(mergeLocal).toEqual({});
    expect(mergeServer).toEqual({});
  });

  it('auto-merges disjoint edits from each side', () => {
    const b = baseState();
    const local = clone(b); local.surplusBank = 300;             // only local
    const server = clone(b); server.years[0].grant = 1500;       // only server
    const { conflicts, mergeLocal, mergeServer } = findConflicts(diffStates(b, local), diffStates(b, server));
    expect(conflicts).toEqual([]);
    expect(mergeLocal).toHaveProperty('surplusBank');
    expect(mergeServer).toHaveProperty('years[0].grant');
  });

  it('separates conflicting from non-conflicting keys in one pass', () => {
    const b = baseState();
    const local = clone(b); local.surplusBank = 300; local.darkMode = true;
    const server = clone(b); server.surplusBank = 400; server.years[0].grant = 1500;
    const { conflicts, mergeLocal, mergeServer } = findConflicts(diffStates(b, local), diffStates(b, server));
    expect(conflicts.map(c => c.key)).toEqual(['surplusBank']);
    expect(mergeLocal).toHaveProperty('darkMode');       // local-only survives
    expect(mergeServer).toHaveProperty('years[0].grant'); // server-only survives
  });
});

// ── Conflict-display helpers (the conflict-resolution UI) ────────────────────
describe('fmtConflictVal', () => {
  const data = { categories: [{ id: 'food', label: 'Food' }] };
  it('labels removed and boolean values', () => {
    expect(fmtConflictVal('darkMode', null, data)).toBe('(removed)');
    expect(fmtConflictVal('darkMode', true, data)).toBe('On');
    expect(fmtConflictVal('darkMode', false, data)).toBe('Off');
  });
  it('money-formats numbers under money-ish keys, plain otherwise', () => {
    expect(fmtConflictVal('years[0].monthly.food', 500, data)).toBe('$500');
    expect(fmtConflictVal('someCount', 3, data)).toBe('3');
  });
  it('summarizes objects by name/label', () => {
    expect(fmtConflictVal('subscriptions[s1]', { name: 'Netflix', amount: 15 }, data)).toBe('Netflix — $15');
    expect(fmtConflictVal('stepGoals[step1]', { label: 'Step 1', targetAmount: 850 }, data)).toBe('Step 1 — $850');
  });
});

describe('conflictLabel', () => {
  const data = {
    categories: [{ id: 'food', label: 'Food' }],
    subscriptions: [{ id: 's1', name: 'Netflix' }],
  };
  it('describes year monthly, override, and field keys in plain language', () => {
    expect(conflictLabel('years[0].monthly.food', data)).toBe('Year 1 — Food budget');
    expect(conflictLabel('years[1].monthlyOverrides.Sep.food', data)).toBe('Year 2 — Food override (Sep)');
    expect(conflictLabel('years[0].grant', data)).toBe('Year 1 — Grant');
  });
  it('falls back to "Year N" beyond the hardcoded labels', () => {
    expect(conflictLabel('years[4].grant', data)).toBe('Year 5 — Grant');
  });
  it('names subscriptions and categories from data', () => {
    expect(conflictLabel('subscriptions[s1]', data)).toBe('Subscription: Netflix');
    expect(conflictLabel('categories[food]', data)).toBe('Category: Food');
  });
  it('maps known top-level keys', () => {
    expect(conflictLabel('surplusBank', data)).toBe('Surplus bank');
  });
});
