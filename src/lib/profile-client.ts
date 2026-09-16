import type { Profile } from '@/src/lib/profile';

/**
 * The site's whole network surface, in one typed function — D1 of `docs/conventions-typescript.md`.
 * The survey island calls this and nothing else; there is no bare `fetch` anywhere in `src/`.
 */
export async function storeProfile(profile: Profile): Promise<string> {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error(`the profile did not save (HTTP ${response.status})`);
  return idFrom(await response.json());
}

function idFrom(body: unknown): string {
  const id = isRecord(body) ? body.id : undefined;
  if (typeof id !== 'string') throw new Error('the profile saved but came back without an id');
  return id;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
