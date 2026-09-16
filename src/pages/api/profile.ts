import type { APIRoute } from 'astro';
import { json, parseJson } from '@/src/lib/http';
import { MAX_PROFILE_BYTES, parseProfile } from '@/src/lib/profile';
import { putProfile } from '@/src/lib/profile-store';

/**
 * One of the site's two on-demand routes. I3, confirmed 2026-09-15: `output: 'static'` stays
 * and a route opts out here, which is what the Cloudflare adapter is for.
 *
 * D1 said "exactly one on-demand route" when it was ratified, before `PLAN.md` Phase 3 step 4
 * spelled the store out as a POST *and* a `GET /p/<id>`. Both need the KV binding, so there are
 * two; the design's intent — everything that can be static stays static — is unchanged, and the
 * deviation is written back under D1 as an `As built:` note.
 */
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  // Bytes, not `body.length` — that counts UTF-16 units, so 16k CJK characters would pass a
  // 16 KB cap and store about 48 KB. The body is already buffered by `text()` either way; the
  // platform's own request limit is what stops something enormous before this line.
  if (byteLength(body) > MAX_PROFILE_BYTES) return json({ error: 'profile too large' }, 413);

  const profile = parseProfile(parseJson(body));
  if (profile === null) return json({ error: 'not a profile' }, 400);

  return json({ id: await putProfile(profile) }, 201);
};

function byteLength(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

/** Anything but a POST is a 405 rather than Astro's default 404, which reads like a typo. */
export const ALL: APIRoute = () => json({ error: 'POST a profile here' }, 405);
