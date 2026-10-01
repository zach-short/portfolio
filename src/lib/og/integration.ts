import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';

import type { Card } from '@/src/lib/og/card';
import { cardPath } from '@/src/lib/og/card-path';
import { loadKit, renderCard, renderIcon } from '@/src/lib/og/render';

/**
 * Renders every page's share image after the pages are built.
 *
 * It runs in Node, after the build, because the pages are prerendered inside workerd, where
 * neither sharp (a native addon) nor satori's wasm can load. `prerenderEnvironment: 'node'`
 * would lift that, and was tried and rejected: it changes how the whole site's CSS is
 * compiled (the `-webkit-backdrop-filter` prefix disappears from `.glass` and `.card`), a side
 * effect far larger than the feature.
 *
 * The card list comes from `/og/cards.json`, an endpoint in the page build; this reads it,
 * renders each entry to `dist/client/og/`, deletes it, and then fails the build if any page
 * points `og:image` at a file that was not written.
 */
export function ogCards(): AstroIntegration {
  let root = '';
  return {
    name: 'og-cards',
    hooks: {
      'astro:config:done': ({ config }) => {
        root = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const cards = await takeCards(out);
        const kit = await loadKit(root);
        for (const card of cards) await put(out, cardPath(card.path), await renderCard(kit, card));
        await put(out, '/apple-touch-icon.png', await renderIcon(kit, 180));
        await put(out, '/favicon.png', await renderIcon(kit, 64));
        await assertEveryPageHasItsImage(out);
        logger.info(`${cards.length} share images, 2 icons`);
      },
    },
  };
}

async function takeCards(out: string): Promise<Card[]> {
  const file = join(out, 'og/cards.json');
  try {
    return JSON.parse(await readFile(file, 'utf8')) as Card[];
  } finally {
    // The list carries absolute paths from this machine; it must not reach the deploy.
    await rm(file, { force: true });
  }
}

async function put(out: string, path: string, data: Buffer): Promise<void> {
  const file = join(out, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
}

const IMAGE_META = /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/;

async function assertEveryPageHasItsImage(out: string): Promise<void> {
  const pages = (await readdir(out, { recursive: true })).filter((file) => file.endsWith('.html'));
  const missing: string[] = [];
  for (const page of pages) {
    const image = IMAGE_META.exec(await readFile(join(out, page), 'utf8'))?.[1];
    if (image && !(await exists(join(out, new URL(image).pathname)))) missing.push(`${page} -> ${image}`);
  }
  if (missing.length > 0) {
    throw new Error(`og-cards: pages point og:image at a file that was not written. Add them to src/lib/og/cards.ts:\n  ${missing.join('\n  ')}`);
  }
}

async function exists(file: string): Promise<boolean> {
  return stat(file).then(() => true, () => false);
}
