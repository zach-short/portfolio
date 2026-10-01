/**
 * The card palette, read from `src/styles/global.css` rather than copied out of it (S1).
 *
 * Satori paints with literal colours and cannot resolve `var(--accent)`, so the cards need the
 * values themselves. Reading them from the stylesheet keeps the "re-skinning the site is editing
 * two lines" promise at the head of `:root` true for the previews too: change `--accent` and the
 * next build repaints every card.
 */
export interface Tokens {
  ground: string;
  cream: string;
  muted: string;
  faint: string;
  accent: string;
  accent2: string;
  edge: string;
  edgeStrong: string;
}

// Only plain values: the derived tokens (`--accent-deep` and friends) are `color-mix` calls,
// which this reader cannot evaluate, so the cards derive their shades with `withAlpha` instead.
const NEEDED: Record<keyof Tokens, string> = {
  ground: '--ground',
  cream: '--cream',
  muted: '--muted',
  faint: '--faint',
  accent: '--accent',
  accent2: '--accent-2',
  edge: '--edge',
  edgeStrong: '--edge-strong',
};

function rootBlock(css: string): string {
  const block = /:root\s*\{([\s\S]*?)\n\}/.exec(css);
  if (!block) throw new Error('og tokens: no :root block in global.css');
  return block[1].replace(/\/\*[\s\S]*?\*\//g, '');
}

export function readTokens(css: string): Tokens {
  const declared = new Map<string, string>();
  for (const [, name, value] of rootBlock(css).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    declared.set(name, value.trim());
  }
  const tokens = {} as Tokens;
  for (const [key, name] of Object.entries(NEEDED) as [keyof Tokens, string][]) {
    const value = declared.get(name);
    if (!value) throw new Error(`og tokens: ${name} is missing from :root in global.css`);
    tokens[key] = value;
  }
  return tokens;
}

/** `#0FA79A` and `0.5` become `rgba(15, 167, 154, 0.5)`. Hex only: a token that is not hex fails loudly. */
export function withAlpha(hex: string, alpha: number): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`og tokens: expected a 6-digit hex colour, got "${hex}"`);
  const n = parseInt(match[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}
