/**
 * Where a page's share image lives, from the page's own path.
 *
 * One function on both sides: `Base.astro` writes it into `og:image`, and the build step writes
 * the file to it. They cannot drift because there is no second copy of the rule.
 *
 * The root has no name of its own, so it is `index`. A path that already carries a trailing
 * slash is normalised first, because `Astro.url.pathname` has one at build time and the canonical
 * form on this site does not (`Base.astro`).
 */
export function cardPath(pathname: string): string {
  const bare = pathname.replace(/\/+$/, '');
  return `/og${bare === '' ? '/index' : bare}.jpg`;
}
