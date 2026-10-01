import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import satori from 'satori';
import sharp from 'sharp';

import { CARD_HEIGHT, CARD_WIDTH, iconLayout, layout, type Card } from '@/src/lib/og/card';
import { readTokens, type Tokens } from '@/src/lib/og/tokens';

// The site's own faces, subset to Latin and converted from woff2 to ttf, because satori cannot
// read woff2. `fonts/subset.py` regenerates them from `public/fonts`.
const FONTS = [
  { name: 'Bricolage Display', file: 'BricolageGrotesque_72pt-Bold.ttf', weight: 700 },
  { name: 'Onest', file: 'Onest-Regular.ttf', weight: 400 },
  { name: 'Onest', file: 'Onest-SemiBold.ttf', weight: 600 },
  { name: 'Onest', file: 'Onest-Bold.ttf', weight: 700 },
  { name: 'Geist Mono', file: 'GeistMono-Medium.ttf', weight: 500 },
] as const;

export interface RenderKit {
  root: string;
  tokens: Tokens;
  fonts: { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' }[];
  grain: Buffer;
  screens: Map<string, string>;
}

/** Everything a render needs that does not change from card to card, read once per build. */
export async function loadKit(root: string): Promise<RenderKit> {
  const fontDir = join(root, 'src/lib/og/fonts');
  const fonts = await Promise.all(
    FONTS.map(async ({ name, file, weight }) => ({ name, weight, style: 'normal' as const, data: await readFile(join(fontDir, file)) })),
  );
  const css = await readFile(join(root, 'src/styles/global.css'), 'utf8');
  return { root, tokens: readTokens(css), fonts, grain: await grainTile(root), screens: new Map() };
}

// `.wall-grain`: the site's noise tile, 85 px, laid over the frame at 7 % with an overlay blend.
// Besides matching the page, it breaks up the banding a dark radial gradient shows at 8 bits.
async function grainTile(root: string): Promise<Buffer> {
  return sharp(join(root, 'public/noise.png')).resize(85, 85).toColourspace('srgb').ensureAlpha(0.07).png().toBuffer();
}

// A capture is about a megabyte of PNG, and the card draws it under 300 px wide. Embedding the
// original would put it in every card's SVG; this is the size it is drawn at, twice over.
async function screenData(kit: RenderKit, path: string): Promise<string> {
  const cached = kit.screens.get(path);
  if (cached) return cached;
  const jpeg = await sharp(resolve(kit.root, path)).resize({ width: 600 }).jpeg({ quality: 82 }).toBuffer();
  const uri = `data:image/jpeg;base64,${jpeg.toString('base64')}`;
  kit.screens.set(path, uri);
  return uri;
}

export async function renderCard(kit: RenderKit, card: Card): Promise<Buffer> {
  const screens = await Promise.all((card.screens ?? []).map((path) => screenData(kit, path)));
  const svg = await satori(layout(kit.tokens, card, screens) as Parameters<typeof satori>[0], {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: kit.fonts,
  });
  return sharp(Buffer.from(svg))
    .composite([{ input: kit.grain, tile: true, blend: 'overlay' }])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toBuffer();
}

/** A square PNG of the site icon. Satori draws the text as paths, so a small size stays crisp. */
export async function renderIcon(kit: RenderKit, size: number): Promise<Buffer> {
  const svg = await satori(iconLayout(kit.tokens, size) as Parameters<typeof satori>[0], { width: size, height: size, fonts: kit.fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
