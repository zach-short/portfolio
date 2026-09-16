import type { APIRoute } from 'astro';
import { immutableJson, json } from '@/src/lib/http';
import { getProfile } from '@/src/lib/profile-store';

/**
 * The stored profile, as JSON and nothing else — not a page.
 *
 * That is a contract with the other repo, not a preference: personal-config's
 * `setup --from <8-char id>` resolves the id to `<homepage>/p/<id>` and `fetch`es it expecting
 * the profile object itself (`src/lib/profile-source.ts`, `HANDOFF` step 7). An HTML wrapper
 * here would break rung 2 for every visitor.
 */
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const stored = await getProfile(params.id ?? '');
  // A malformed id and an id nobody has claimed are the same answer on purpose: the id is the
  // only access control there is (`DESIGN.md` §2), so the route says as little as it can.
  if (stored === null) return json({ error: 'no profile with that id' }, 404);
  return immutableJson(stored);
};
