import { askedQuestions, catalog, type AnswerValue, type Answers } from '@/src/lib/catalog';

/**
 * What `POST /api/profile` stores and `GET /p/<id>` serves back.
 *
 * The shape is personal-config's own `Partial<Config>`, because `setup --from` feeds it
 * straight into that merge as the top layer (`src/lib/config.ts`). Every answer sits flat under
 * `answers`, keyed by its question's `configKey` — including the dotted ones like `models.deep`
 * and `practices.comments` — which is exactly what `askPhase` writes. Nothing here is nested to
 * match `starter.json`'s top-level `projectsDir` or `models`: the wizard reads
 * `answers['models.deep'] ?? config.models.deep`, so the flat form wins and stays one shape.
 */
export type Profile = {
  catalogVersion: string;
  answers: Answers;
};

/**
 * `commit-policy-practice` is the hidden derived question: `when: { never: true }`, so neither
 * the wizard nor this survey ever shows it. personal-config's renderer derives it from the
 * `you` phase's commit answer (`src/render/standard.ts:79-83`), and the profile carries the
 * same derivation so a survey-produced profile cannot disagree with what gets rendered from it.
 * A hand-written profile POSTed straight at the endpoint can disagree — `parseProfile` does not
 * check answers against the catalog — and that is fine, for the reason recorded there.
 */
const DERIVED = 'practices.commit-policy-practice';

const DERIVED_FROM = 'commitPolicy';

/** Everything the survey collected, in the shape `--from` takes. */
export function toProfile(answers: Answers): Profile {
  const given = askedQuestions(answers)
    .map((question) => [question.configKey, answers[question.configKey]] as const)
    .filter((entry): entry is [string, AnswerValue] => isGiven(entry[1]));
  const derived = answers[DERIVED_FROM];
  const kept = Object.fromEntries(derived === undefined ? given : [...given, [DERIVED, derived]]);
  return { catalogVersion: catalog.catalogVersion, answers: kept };
}

/**
 * An untouched text answer is dropped rather than stored as `""`. The wizard reads
 * `answers.projectsDir ?? config.projectsDir`, and `??` does not fall through an empty string —
 * so a stored `""` would beat the starter default and point `setup` at nothing.
 */
function isGiven(value: AnswerValue | undefined): boolean {
  return value !== undefined && value !== '';
}

/** The stored body is capped well above a full profile — 30 answers is roughly a kilobyte. */
export const MAX_PROFILE_BYTES = 16 * 1024;

/**
 * Parsed JSON is `unknown` until something narrows it. This is the site's one untrusted
 * boundary: the body of a POST anybody can make.
 *
 * **The return copies exactly two fields, and that is the security property — do not
 * "simplify" it to a spread or a cast.** `mergeLayer` in personal-config's `src/lib/config.ts`
 * takes `profile`, `identity`, `models`, `projectsDir` and `archiveHome` from the `--from`
 * layer, and that layer sits *above* the saved config, so it wins. Rebuilding the object from
 * two named fields is what stops a POST smuggling any of them onto the machine of whoever runs
 * `--from <that id>`.
 *
 * What does get through is unvalidated against the catalog — arbitrary answer keys, any
 * `catalogVersion`, a `commit-policy-practice` that disagrees with `commitPolicy`. That is
 * accepted: it lands only on the machine of someone who chose to run `--from` on that id, the
 * same trust class as `--from ./some-file.json`, and never on another visitor.
 *
 * `__proto__` and `constructor` are inert here rather than filtered, and it is worth knowing
 * why: `JSON.parse` creates them as ordinary own properties, and a spread defines own
 * properties rather than assigning through the prototype chain. That holds only while the
 * consumer's merge stays shallow — a deep-merge helper over there would reopen it.
 */
export function parseProfile(parsed: unknown): Profile | null {
  if (!isRecord(parsed) || !isRecord(parsed.answers)) return null;
  if (typeof parsed.catalogVersion !== 'string') return null;
  if (!Object.values(parsed.answers).every(isAnswerValue)) return null;
  return { catalogVersion: parsed.catalogVersion, answers: parsed.answers as Answers };
}

function isAnswerValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.every((item) => typeof item === 'string');
  return typeof value === 'string' || typeof value === 'boolean';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
