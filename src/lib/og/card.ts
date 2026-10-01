import { fitChips, pillWidth } from '@/src/lib/og/text';
import { withAlpha, type Tokens } from '@/src/lib/og/tokens';

/**
 * One share image, as data. The registry (`cards.ts`) builds these from the same modules the
 * pages read, and `layout` below turns each one into the tree satori paints.
 */
export interface Card {
  /** The page this card previews, as the canonical path: `/`, `/blog/leetcode/two-sum`. */
  path: string;
  eyebrow: string;
  title: string;
  blurb?: string;
  chips?: string[];
  /** A line set in mono inside a glass pill: the command a visitor runs, or a complexity. */
  mono?: string;
  /** Phone captures to show, as file paths (absolute, or from the repo root). One is upright; two overlap and tilt. */
  screens?: string[];
  /** A huge, faint figure behind the text. Only the LeetCode number uses it. */
  figure?: string;
}

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;
// The captures' own aspect (`projects.ts`, BD-9): the phone is shaped to them so nothing crops.
const SCREEN_ASPECT = 2622 / 1206;

export interface SatoriNode {
  type: string;
  props: { style?: Record<string, string | number>; children?: SatoriNode[] | string; [key: string]: unknown };
}
type Style = Record<string, string | number>;

function box(style: Style, ...children: (SatoriNode | false | undefined)[]): SatoriNode {
  return { type: 'div', props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) as SatoriNode[] } };
}

function text(style: Style, content: string): SatoriNode {
  return { type: 'div', props: { style: { display: 'flex', ...style }, children: content } };
}

/**
 * The page's wall, repainted: `.wall-ember` and `.wall-amber` in `global.css`, at the sizes the
 * stylesheet gives them as fractions of the frame, so a card reads as the page it previews.
 *
 * The ember is placed where `wall.ts` rests it on the first frame (centre at 0 and 0.73 of the
 * frame, `startWall`'s polar orbit forty seconds in), not at the stylesheet's own offset, which
 * the script overwrites on load and which sits mostly below the fold. The amber never moves.
 */
function wall(t: Tokens): SatoriNode[] {
  const glow = (w: number, h: number, left: number, top: number, color: string, stop: number): SatoriNode =>
    box({
      position: 'absolute', width: w, height: h, left, top,
      backgroundImage: `radial-gradient(ellipse ${Math.round(w / 2)}px ${Math.round(h / 2)}px at 50% 50%, ${color} 0%, ${withAlpha(t.ground, 0)} ${stop}%)`,
    });
  const W = CARD_WIDTH;
  const H = CARD_HEIGHT;
  return [
    glow(W * 1.16, H * 0.7, -W * 0.58, H * 0.38, withAlpha(t.accent, 0.6), 62),
    glow(W * 1.2, H * 0.8, W * 0.3, -H * 0.44, withAlpha(t.accent2, 0.14), 60),
  ];
}

function wordmark(t: Tokens): SatoriNode {
  return text({ fontFamily: 'Bricolage Display', fontWeight: 700, fontSize: 52, letterSpacing: '-0.03em', color: t.cream }, 'zs');
}

function eyebrow(t: Tokens, label: string): SatoriNode {
  return text(
    { fontFamily: 'Onest', fontWeight: 700, fontSize: 25, letterSpacing: '0.13em', textTransform: 'uppercase', color: t.accent2 },
    label,
  );
}

// The largest size at which the title is expected to fit `maxHeight` px. Bricolage Bold runs
// about 0.52 em per character; the estimate is deliberately a little wide so a long title
// shrinks rather than overflows.
function titleSize(title: string, width: number, maxHeight: number): number {
  for (const size of [118, 104, 92, 80, 70, 62, 54]) {
    const lines = Math.ceil((title.length * size * 0.56) / width);
    if (lines * size * 1.02 <= maxHeight) return size;
  }
  return 48;
}

function chip(t: Tokens, label: string): SatoriNode {
  return text(
    {
      fontFamily: 'Onest', fontWeight: 700, fontSize: 21, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: t.muted, border: `1.5px solid ${t.edgeStrong}`, borderRadius: 9999, padding: '10px 20px',
    },
    label,
  );
}

// `.glass` from `global.css`: the 160-degree white wash and the stronger edge.
function pill(t: Tokens, line: string): SatoriNode {
  return text(
    {
      fontFamily: 'Geist Mono', fontWeight: 500, fontSize: 30, color: t.cream, padding: '16px 30px', borderRadius: 9999,
      border: `1.5px solid ${t.edgeStrong}`,
      backgroundImage: 'linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
    },
    line,
  );
}

// `.thumb` on the home cards, scaled up: a hairline edge, a rounded bezel, a long soft shadow.
function phone(t: Tokens, src: string, width: number, place: Style): SatoriNode {
  const height = Math.round(width * SCREEN_ASPECT);
  return box(
    {
      position: 'absolute', width, height, borderRadius: Math.round(width * 0.15), overflow: 'hidden',
      border: `2px solid ${t.edgeStrong}`, background: t.ground, boxShadow: '0 40px 90px rgba(0, 0, 0, 0.6)', ...place,
    },
    { type: 'img', props: { src, width, height, style: { width, height, objectFit: 'cover' } } },
  );
}

function phones(t: Tokens, screens: string[]): SatoriNode[] {
  if (screens.length === 0) return [];
  if (screens.length === 1) return [phone(t, screens[0], 292, { left: 820, top: 66 })];
  return [
    phone(t, screens[0], 236, { left: 700, top: 118, transform: 'rotate(-6deg)' }),
    phone(t, screens[1], 256, { left: 894, top: 56, transform: 'rotate(5deg)' }),
  ];
}

function figure(t: Tokens, digits: string): SatoriNode {
  const size = Math.min(520, Math.round(580 / (0.58 * digits.length)));
  return box(
    { position: 'absolute', right: 40, top: 70, fontFamily: 'Bricolage Display', fontWeight: 700, fontSize: size, lineHeight: 1, color: withAlpha(t.accent, 0.11) },
    text({}, digits),
  );
}

// The band between the wordmark and the footer is about 376 px tall. The eyebrow and its gap
// take 78 of it, and a blurb (two lines at most, plus its gap) takes 114 more; the title gets
// what is left.
const BAND = 376;

function copy(t: Tokens, card: Card, width: number): SatoriNode {
  const room = BAND - 78 - (card.blurb ? 114 : 0);
  return box(
    { flexDirection: 'column', gap: 22, width },
    eyebrow(t, card.eyebrow),
    text({ fontFamily: 'Bricolage Display', fontWeight: 700, fontSize: titleSize(card.title, width, room), lineHeight: 1.02, letterSpacing: '-0.025em', color: t.cream, textWrap: 'balance' }, card.title),
    card.blurb ? text({ fontFamily: 'Onest', fontWeight: 400, fontSize: 32, lineHeight: 1.42, color: t.muted, display: 'block', lineClamp: 2 }, card.blurb) : undefined,
  );
}

function footer(t: Tokens, card: Card, width: number): SatoriNode {
  const budget = width - (card.mono ? pillWidth(card.mono) + 12 : 0);
  return box(
    { gap: 12, alignItems: 'center' },
    card.mono ? pill(t, card.mono) : undefined,
    ...fitChips(card.chips ?? [], budget).map((label) => chip(t, label)),
  );
}

export function layout(t: Tokens, card: Card, screenData: string[]): SatoriNode {
  // The column ends before the phones begin: the single phone starts at 820, the pair at 700.
  const width = [960, 640, 620][screenData.length];
  return box(
    { position: 'relative', width: CARD_WIDTH, height: CARD_HEIGHT, background: t.ground, color: t.cream, fontFamily: 'Onest', overflow: 'hidden' },
    ...wall(t),
    card.figure ? figure(t, card.figure) : undefined,
    ...phones(t, screenData),
    box({ position: 'absolute', left: 72, top: 56 }, wordmark(t)),
    box({ position: 'absolute', left: 72, top: 128, width, height: BAND, flexDirection: 'column', justifyContent: 'center' }, copy(t, card, width)),
    box({ position: 'absolute', left: 72, bottom: 56, width }, footer(t, card, width)),
  );
}

/**
 * The site icon: the nav's `zs` wordmark on the ground, with the ember glow low on the left like
 * the page. Square and opaque, because iOS fills transparency on a home-screen icon with black.
 */
export function iconLayout(t: Tokens, size: number): SatoriNode {
  return box(
    { position: 'relative', width: size, height: size, background: t.ground, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    box({
      position: 'absolute', width: size * 1.4, height: size * 1.1, left: -size * 0.7, top: size * 0.4,
      backgroundImage: `radial-gradient(ellipse ${Math.round(size * 0.7)}px ${Math.round(size * 0.55)}px at 50% 50%, ${withAlpha(t.accent, 0.6)} 0%, ${withAlpha(t.ground, 0)} 62%)`,
    }),
    text({ fontFamily: 'Bricolage Display', fontWeight: 700, fontSize: Math.round(size * 0.52), letterSpacing: '-0.03em', color: t.cream }, 'zs'),
  );
}
