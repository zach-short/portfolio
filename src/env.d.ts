/**
 * The one Cloudflare binding this site uses (D7), declared by hand.
 *
 * Not taken from the generated `env.d.ts` at the repo root: `tsconfig.json:24` excludes that
 * file from the program, and regenerating it means `bun run cf-typegen`, which rewrites all
 * 237 KB of it and buries the real diff — `CLAUDE.md` forbids that for a change this size.
 * Only the two methods `profile-store.ts` actually calls are declared, so anything else would
 * be a type error rather than a runtime one.
 */
declare module 'cloudflare:workers' {
  export const env: {
    /**
     * Stored survey profiles, keyed by DIAL-6's eight-character id. Written by
     * `POST /api/profile`, read by `GET /p/<id>`. Bound in `wrangler.worker.jsonc`.
     */
    PROFILES: {
      get(key: string): Promise<string | null>;
      put(key: string, value: string): Promise<void>;
    };
  };
}
