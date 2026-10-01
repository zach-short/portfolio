import type { APIRoute } from 'astro';

import { getCards } from '@/src/lib/og/cards';

/**
 * The card list, written to `dist/client/og/cards.json` at build time and read back by the
 * og-cards integration, which deletes it before the build ends.
 *
 * It is an endpoint rather than a function the integration calls because the list needs
 * `astro:content` and the imported project captures, and neither exists outside Vite. The
 * integration renders in Node (satori and sharp cannot run in the workerd that prerenders the
 * pages), so the data crosses between the two as a file.
 */
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(await getCards()), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
