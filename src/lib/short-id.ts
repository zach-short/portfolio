/**
 * DIAL-6, answered 2026-09-15: eight characters of `[a-z0-9]`, crypto-random.
 *
 * The shape is not cosmetic. It is the only access control a stored profile has
 * (`DESIGN.md` §2 — no auth), and personal-config's `--from` resolver tells a bare id from a
 * relative path by exactly this regex (`src/lib/profile-source.ts`), so generating a different
 * shape breaks rung 2 without breaking anything a gate can see.
 */
export const SHORT_ID = /^[a-z0-9]{8}$/;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

const ID_LENGTH = 8;

/**
 * Rejection ceiling. 256 is not a multiple of 36, so a plain `byte % 36` would make the first
 * four letters of the alphabet about 14 % likelier than the rest — a quiet shave off the only
 * property this id has to offer. Bytes at or above 252 are drawn again instead.
 */
const CEILING = Math.floor(256 / ALPHABET.length) * ALPHABET.length;

/** Eight unbiased characters from `crypto.getRandomValues`, never `Math.random`. */
export function shortId(): string {
  const chars: string[] = [];
  while (chars.length < ID_LENGTH) {
    for (const byte of crypto.getRandomValues(new Uint8Array(ID_LENGTH))) {
      if (byte < CEILING && chars.length < ID_LENGTH) chars.push(ALPHABET[byte % ALPHABET.length]);
    }
  }
  return chars.join('');
}
