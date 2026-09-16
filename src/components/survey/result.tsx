/** @jsxImportSource preact */
import { rungsFor } from '@/src/lib/rungs';
import { RESULT } from '@/src/lib/setup-copy';
import { CopyLine } from '@/src/components/survey/copy-line';

type Props = { id: string; origin: string };

/**
 * D7's three rungs, in D7's order, all three on screen at once.
 *
 * That is the design, not a layout preference. Rung 1 is the only one that delivers the product
 * claim — one click to a configured repo — and for a first-time visitor it does **nothing at
 * all**, silently, because Claude Code registers its URL handler only when you send your first
 * prompt of an interactive session (I6, re-verified 2026-09-16). A visitor who has to click
 * something before the fallbacks appear has already hit the failure the fallbacks exist for.
 *
 * Everything here is derived from the id alone. That is what lets `?p=<id>` restore the page on
 * a refresh without re-fetching anything, and it is why rung 3 downloads `/p/<id>` itself
 * rather than a copy of the answers held in this tab: there is one profile, and it is the
 * stored one.
 */
export function Result({ id, origin }: Props) {
  const rungs = rungsFor(id, origin);

  return (
    <section class="survey-result">
      <p class="eyebrow ember">{RESULT.eyebrow}</p>
      <h2 class="display">{RESULT.heading}</h2>
      <p class="lede">{RESULT.lede}</p>
      <p class="survey-permalink mono">
        <a href={`/p/${id}`}>{rungs.profileUrl}</a>
      </p>

      <article class="card survey-rung">
        <p class="eyebrow amber">{RESULT.oneEyebrow}</p>
        <a class="glass prominent large" href={rungs.deepLink}>{RESULT.oneLabel}</a>
        <p class="muted">{RESULT.oneNote}</p>
        <p class="faint survey-fallback">{RESULT.oneFallback}</p>
      </article>

      <article class="card survey-rung">
        <p class="eyebrow amber">{RESULT.twoEyebrow}</p>
        <h3 class="display">{RESULT.twoLabel}</h3>
        <CopyLine command={rungs.claudeCommand} label={RESULT.twoLabel} />
        <p class="muted">{RESULT.twoNote}</p>
      </article>

      <article class="card survey-rung">
        <p class="eyebrow amber">{RESULT.threeEyebrow}</p>
        <h3 class="display">{RESULT.threeLabel}</h3>
        <a class="glass" href={`/p/${id}`} download="profile.json">{RESULT.threeDownload}</a>
        <CopyLine command={rungs.setupCommand} label={RESULT.threeLabel} />
        <p class="muted">{RESULT.threeNote}</p>
      </article>
    </section>
  );
}
