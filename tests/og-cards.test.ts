import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'bun:test';

import { cardPath } from '@/src/lib/og/card-path';
import { chipWidth, firstSentence, fitChips } from '@/src/lib/og/text';
import { readTokens, withAlpha } from '@/src/lib/og/tokens';

/**
 * The pure parts of the share-image pipeline: the palette read out of the stylesheet, the page
 * path to image path rule, and the two text helpers the layout leans on. The rendering itself is
 * checked by the build, which fails if any page's `og:image` names a file that was not written.
 */
describe('readTokens, against the real stylesheet', () => {
  const tokens = readTokens(readFileSync('src/styles/global.css', 'utf8'));

  test('reads the two accent hexes from the head of :root', () => {
    expect(tokens.accent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(tokens.accent2).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test('reads the ground the whole site sits on', () => {
    expect(tokens.ground).toBe('#0F0D0B');
  });
});

describe('readTokens, on made-up input', () => {
  test('a missing token fails by name rather than painting undefined', () => {
    expect(() => readTokens(':root {\n  --ground: #000000;\n}\n')).toThrow('--cream');
  });

  test('a comment inside :root is not read as a declaration', () => {
    const css = ':root {\n  /* --accent: #ffffff; */\n  --accent: #112233;\n}\n';
    expect(() => readTokens(css)).toThrow('--ground');
  });
});

describe('withAlpha', () => {
  test('splits a hex into channels', () => {
    expect(withAlpha('#0FA79A', 0.5)).toBe('rgba(15, 167, 154, 0.5)');
  });

  test('a colour that is not 6-digit hex is refused', () => {
    expect(() => withAlpha('rgba(1, 2, 3, 0.1)', 0.5)).toThrow();
  });
});

describe('cardPath', () => {
  test('the root is named index', () => {
    expect(cardPath('/')).toBe('/og/index.jpg');
  });

  test('a path with or without its trailing slash maps to the same file', () => {
    expect(cardPath('/blog/leetcode/two-sum/')).toBe('/og/blog/leetcode/two-sum.jpg');
    expect(cardPath('/blog/leetcode/two-sum')).toBe('/og/blog/leetcode/two-sum.jpg');
  });
});

describe('firstSentence', () => {
  test('stops at the first full stop', () => {
    expect(firstSentence('The app blocker with no unblock button. Loosening waits a day.')).toBe(
      'The app blocker with no unblock button.',
    );
  });

  test('a colon ends it and becomes a full stop', () => {
    expect(firstSentence('Food from down the road: a backyard grower drops off surplus.')).toBe('Food from down the road.');
  });

  test('a dot inside a word is not a sentence end', () => {
    expect(firstSentence('Runs on Next.js and Go. Fast.')).toBe('Runs on Next.js and Go.');
  });

  test('a blurb with no stop is returned whole', () => {
    expect(firstSentence('No punctuation here')).toBe('No punctuation here');
  });
});

describe('fitChips', () => {
  test('keeps chips in order until the next one would overrun the row', () => {
    const budget = chipWidth('go') + 12 + chipWidth('array');
    expect(fitChips(['go', 'array', 'hashmap'], budget)).toEqual(['go', 'array']);
  });

  test('drops a duplicate that differs only in case', () => {
    expect(fitChips(['Go', 'go', 'array'], 1000)).toEqual(['Go', 'array']);
  });

  test('a budget too small for the first chip keeps none', () => {
    expect(fitChips(['go'], 10)).toEqual([]);
  });
});
