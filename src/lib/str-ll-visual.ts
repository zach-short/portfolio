// Ported from app/blog/components/string-ll-visual.ts. Used inline in MDX bodies as
// `{strLLVisual([...])}` — only content/leetcode/add-two-numbers.tsx and reverse-linked-list.tsx.
export function strLLVisual(vals: number[]): string {
  let str = '';
  for (let i = 0; i < vals.length - 1; i++) {
    str += `${vals[i]} -> `;
  }
  str += vals[vals.length - 1];
  return str;
}
