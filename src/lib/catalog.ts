import catalogJson from 'personal-config/catalog.json';

/**
 * The shapes `catalog.json` carries, re-declared here rather than imported from
 * personal-config's TypeScript. D6 pins a generated artifact, not a source tree: importing its
 * `src/` would drag `@clack/prompts` into a browser bundle, and `src/phases/run.ts` is not
 * browser-safe at all (`DESIGN.md` §1.3, P3).
 */
export type AnswerValue = string | boolean | string[];

export type Answers = Record<string, AnswerValue>;

export type Phase = 'you' | 'discover' | 'practices';

export type QuestionOption = {
  value: string;
  label: string;
  example: string;
  recommended?: boolean;
};

/**
 * A condition as data rather than a closure — which is why the catalog can carry it at all.
 * `never` marks a question whose value is derived somewhere else.
 */
export type WhenSpec =
  | { never: true }
  | { key: string; is: AnswerValue }
  | { key: string; isNot: AnswerValue };

export type Question = {
  id: string;
  phase: Phase;
  kind: 'select' | 'text';
  ask: string;
  options?: QuestionOption[];
  placeholder?: string;
  readMore: string;
  configKey: string;
  when?: WhenSpec;
};

export type CatalogChoice = { id: string; body: string };

export type Catalog = {
  catalogVersion: string;
  questions: Question[];
  choices: CatalogChoice[];
};

/** The one assertion in the file: JSON arrives structurally typed and is narrowed once, here. */
export const catalog = catalogJson as Catalog;

/**
 * Whether a question's condition holds for the answers so far. A port of personal-config's
 * `src/lib/when.ts`, kept line for line: the browser must not ask a question the terminal would
 * skip, and the only thing making that true is both sides running the same rule.
 */
export function matchesWhen(spec: WhenSpec | undefined, answers: Answers): boolean {
  if (spec === undefined) return true;
  if ('never' in spec) return false;
  const actual = answers[spec.key];
  return 'is' in spec ? sameAnswer(actual, spec.is) : !sameAnswer(actual, spec.isNot);
}

/** `undefined` never equals a spec's value — an unasked question has not met a condition. */
function sameAnswer(actual: AnswerValue | undefined, expected: AnswerValue): boolean {
  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
    return actual.length === expected.length && actual.every((v, i) => v === expected[i]);
  }
  return actual === expected;
}

/**
 * The questions actually in play for the answers so far — the survey's own length, and the set
 * the stored profile is built from. A conditional question answered and then conditioned away
 * (pick `team`, name a tracker, go back, pick `solo`) drops out here rather than travelling to
 * a repo that has no team.
 */
export function askedQuestions(answers: Answers): Question[] {
  return catalog.questions.filter((question) => matchesWhen(question.when, answers));
}

/** The long form behind a question's `Read more`, or nothing if the catalog has no such id. */
export function longFormFor(readMore: string): string | undefined {
  return catalog.choices.find((choice) => choice.id === readMore)?.body;
}

/**
 * The wizard's own starting value, from `defaultFor` in `src/phases/run.ts`: the recommended
 * option, else the first. Text questions have no options and a browser has no merged config to
 * take a default from, so they start empty — `toProfile` drops an answer that stays that way.
 */
export function defaultAnswer(question: Question): string {
  if (question.kind === 'text') return TEXT_DEFAULTS[question.configKey] ?? '';
  const options = question.options ?? [];
  return options.find((option) => option.recommended)?.value ?? options[0]?.value ?? '';
}

/**
 * The one text answer worth pre-filling. `projectsDir` is where `setup` looks for repos and an
 * empty one sends it nowhere; `profiles/starter.json` carries this same value.
 */
const TEXT_DEFAULTS: Record<string, string> = { projectsDir: '~/Projects' };
