import { describe, expect, test } from 'bun:test';
import { matchesWhen, type Answers, type WhenSpec } from '@/src/lib/catalog';

/**
 * The `all:` conjunction in `matchesWhen`, which is the browser's half of a rule the terminal
 * also runs (setup-tracks `DESIGN.md` D14). Nothing sends an `all:` yet — the pinned
 * `catalog.json` carries none and will not until personal-config publishes one — so these
 * assertions are the only thing standing between this port and a silent divergence.
 *
 * **This is the repo's first test file**, added because the invariant it guards fails quietly:
 * a wrong answer here does not crash, it asks a stranger a question the terminal would skip.
 * Run with `bun test`.
 */
const held: WhenSpec = { key: 'mode', is: 'team' };
const failed: WhenSpec = { key: 'mode', is: 'solo' };
const answers: Answers = { mode: 'team', owned: true };

describe('matchesWhen, the forms that were already there', () => {
  test('no spec at all holds', () => {
    expect(matchesWhen(undefined, answers)).toBe(true);
  });

  test('never holds for nothing', () => {
    expect(matchesWhen({ never: true }, answers)).toBe(false);
  });

  test('isNot holds when the key is absent — an unasked question has met no condition', () => {
    expect(matchesWhen({ key: 'owned', isNot: false }, {})).toBe(true);
  });
});

describe('matchesWhen, the all: conjunction', () => {
  test('every member holding holds', () => {
    expect(matchesWhen({ all: [held, { key: 'owned', is: true }] }, answers)).toBe(true);
  });

  test('one member failing fails the whole spec', () => {
    expect(matchesWhen({ all: [held, failed] }, answers)).toBe(false);
  });

  test('order does not matter — the failure can be first', () => {
    expect(matchesWhen({ all: [failed, held] }, answers)).toBe(false);
  });

  /**
   * Pinned as a decision, not left as whatever `every` happened to do: an `all` with nothing in
   * it states no condition, which is the same claim as no `when` key at all, and a question
   * carrying one is asked.
   */
  test('an empty all holds, vacuously', () => {
    expect(matchesWhen({ all: [] }, answers)).toBe(true);
  });

  test('never inside an all fails it', () => {
    expect(matchesWhen({ all: [held, { never: true }] }, answers)).toBe(false);
  });
});

describe('matchesWhen, all: nested', () => {
  test('an all inside an all holds when both levels hold', () => {
    const spec: WhenSpec = { all: [held, { all: [{ key: 'owned', is: true }] }] };
    expect(matchesWhen(spec, answers)).toBe(true);
  });

  test('a failure two levels down still fails the outer spec', () => {
    const spec: WhenSpec = { all: [held, { all: [held, failed] }] };
    expect(matchesWhen(spec, answers)).toBe(false);
  });

  /**
   * The live case, and the reason the nesting test is not academic. `owned` is derived per repo
   * in the terminal and is therefore *always* `undefined` in a browser, so `track-mode`'s
   * `owned isNot false` is what keeps the site asking it — and D14 puts that spec inside an
   * `all` alongside the git question. If the conjunction mishandled an absent key, the browser
   * would stop asking a question the terminal asks.
   */
  test('an absent key under isNot survives nesting', () => {
    const spec: WhenSpec = {
      all: [{ all: [{ key: 'owned', isNot: false }] }, { key: 'usesGit', is: 'yes' }],
    };
    expect(matchesWhen(spec, { usesGit: 'yes' })).toBe(true);
    expect(matchesWhen(spec, { usesGit: 'no' })).toBe(false);
  });
});
