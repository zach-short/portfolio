/**
 * The first sentence of a blurb, the part that reads as a tagline on its own. A colon ends it
 * too and is swapped for a full stop: "Food from down the road: a backyard grower drops off
 * surplus, ..." is a headline followed by its explanation.
 */
export function firstSentence(blurb: string): string {
  const end = /[.!?:](\s|$)/.exec(blurb);
  if (!end) return blurb;
  const sentence = blurb.slice(0, end.index);
  return blurb[end.index] === ':' ? `${sentence}.` : `${sentence}${blurb[end.index]}`;
}

// Onest Bold at 21 px with 0.12 em tracking is about 15.6 px a letter, plus 20 px of padding and
// a 1.5 px border either side. A chip that overruns its row wraps the footer upward into the
// title, so the estimate errs wide.
export function chipWidth(label: string): number {
  return Math.round(label.length * 15.6 + 43);
}

/** Geist Mono at 30 px is 0.6 em a character; the pill adds 30 px of padding and a border each side. */
export function pillWidth(line: string): number {
  return Math.round(line.length * 18 + 63);
}

/** As many chips, in order, as fit in `budget` px on one row. Duplicates (by case) are dropped. */
export function fitChips(labels: string[], budget: number, gap = 12): string[] {
  const kept: string[] = [];
  const seen = new Set<string>();
  let used = 0;
  for (const label of labels) {
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    const next = used + chipWidth(label) + (kept.length > 0 ? gap : 0);
    if (next > budget) break;
    kept.push(label);
    seen.add(key);
    used = next;
  }
  return kept;
}
