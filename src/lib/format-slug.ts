// Ported from utils/get-leetcode-posts.ts:4-6, verbatim.
export function formatSlug(slug: string): string {
  return slug.replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
