import { env } from 'cloudflare:workers';
import type { Profile } from '@/src/lib/profile';
import { SHORT_ID, shortId } from '@/src/lib/short-id';

/**
 * The only two things that touch KV. Both server-side; `cloudflare:workers` does not exist in a
 * browser, so importing this module from the island would be a build error rather than a
 * runtime surprise.
 */

/**
 * DIAL-3, answered 2026-09-15: **keep forever — no TTL on the put.** A bookmarked `/p/<id>`
 * never breaks, which is the failure the dial was written to flag. The accepted cost is
 * unbounded growth and no deletion path.
 *
 * **The id is not checked free first, and that is deliberate — it was, and the check was
 * removed on 2026-09-16.** A `put` over an existing key overwrites it silently, which would be
 * the one failure here neither a gate nor a walkthrough could catch, so guarding it looked
 * obviously right. It is not, for two reasons.
 *
 * It cannot work. KV has no conditional write, so `get`-then-`put` is a race, and the window is
 * not microseconds: two POSTs drawing the same id both see it free unless the first `put` has
 * already propagated.
 *
 * And it actively breaks the happy path. Cloudflare's KV docs
 * (developers.cloudflare.com/kv/concepts/how-kv-works, read 2026-09-16) say *"Negative lookups
 * indicating that the key does not exist are also cached"*, and *"Visibility of changes takes
 * longer in locations which have recently read a previous version of a given key (including
 * reads that indicated the key did not exist, which are also cached locally)"* — for the
 * default 60-second `cacheTtl`. The guard's own `get` planted that negative at the colo the
 * visitor is sitting behind, one line before writing the key. Their `/p/<id>` link and their
 * first `setup --from <id>` — the very next thing the result page tells them to do — would
 * 404 for up to a minute, on every single successful survey.
 *
 * So the real risk is stated instead of pretended away. It is the birthday bound over 36^8:
 * ~1.8e-7 at a thousand stored profiles, ~1.8e-3 at a hundred thousand. Making it actually
 * impossible needs a store with a conditional write — a Durable Object, or D1 with
 * `INSERT … ON CONFLICT` — which is a decision, not a patch.
 */
export async function putProfile(profile: Profile): Promise<string> {
  const id = shortId();
  await env.PROFILES.put(id, JSON.stringify(profile));
  return id;
}

/**
 * The stored body verbatim, never re-serialised. Not for the consumer's sake — `--from <id>`
 * and `--from ./profile.json` both parse the JSON, so only equivalence matters there — but so
 * that `immutableJson`'s year-long cache header is telling the truth about a body that is
 * genuinely fixed the moment it is written.
 *
 * The shape test is load-bearing, not decoration. Astro's `[id]` already excludes `/` and empty
 * segments, but KV rejects a key over 512 bytes with an error, and `/p/<600 characters>` is a
 * valid route — without this line that is a 500 rather than the 404 it should be. It also keeps
 * junk reads off the bill.
 */
export async function getProfile(id: string): Promise<string | null> {
  if (!SHORT_ID.test(id)) return null;
  return env.PROFILES.get(id);
}
