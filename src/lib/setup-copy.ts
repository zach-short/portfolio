import { askedQuestions, defaultAnswers, type Phase } from '@/src/lib/catalog';

/**
 * Every word a visitor reads on `/setup`, in one file.
 *
 * DIAL-2 (the result page's words) and DIAL-4 (the page title) were answered at GATE 2 in
 * **register only — warm** (`DESIGN.md` §5.1); the words themselves are Phase 3's to draft and
 * are shown to Zach before they ship. They live here rather than inline so that changing one is
 * one edit in one place, which is the whole point of answering a copy dial in register first.
 *
 * Warm, as the register spec defines it: *"That didn't go through — try again"* — second
 * person, plain, no exclamation marks, no marketing.
 *
 * **Every command a visitor is given says `npx`, not `bunx`, and that is deliberate.**
 * personal-config's bin was TypeScript behind a `#!/usr/bin/env bun` shebang until `0.2.3`
 * (2026-09-16), which ships a Node bundle and asks for `node >= 20`. This repo runs on Bun, so
 * `bunx` reads as the house word — but the person reading these strings is a stranger who has
 * Node and almost certainly not Bun, and a second runtime to install before the first command
 * works is the friction `0.2.3` exists to remove. Do not "fix" them back to match this repo.
 */

/**
 * How many questions a visitor is actually asked, counted rather than spelled out.
 *
 * It is the same number the survey's own counter shows on screen one — `survey.tsx` derives its
 * `total` from `askedQuestions(answers)` over the same starting answers — so the sentence and
 * the counter cannot disagree, whatever the pinned catalog grows into.
 *
 * **The hardcoded "Thirty" was already wrong**, which is why this is derivation and not a new
 * number: 30 is `catalog.questions.length`, and that total counts `commit-policy-practice`,
 * which is `never: true` and asked nowhere, as well as the tracker question a solo answer skips.
 * The catalog's total is never the visitor's number, so all three sentences below take this one
 * (setup-tracks `DESIGN.md` §7.1; it is the second half of that design's hazard 4).
 */
const ASKED_COUNT = askedQuestions(defaultAnswers()).length;

/**
 * DIAL-4 — the `/setup` page. `title` is the `<title>`, suffixed with the site name by
 * Base.astro; `ogTitle` is the shared-link card's own title, which is why it names the tool
 * instead. Both are settled copy (`DESIGN.md` §7.1) — "your repo" turned away the visitor this
 * page was rewritten for (D11) before he had read a question, and "how you work" is true of a
 * repo and of a folder without hedging.
 *
 * The body copy below (`description`, `lede`, the phase blurbs and `setupPrompt`) was settled
 * the same day, 2026-09-17, alongside that title: "your projects" replaces "your repo(s)"
 * everywhere a visitor reads it, for the same reason — true of a git repo and of a plain folder,
 * needing no hedging or slash. "where your work lives" (warmer, but a phrase rather than a
 * noun — it does not substitute into "into each ___ it finds") and "repos and folders" (most
 * precise, but reads as a spec, and "folders" means little to the reader this page is for) were
 * both considered and rejected.
 *
 * **`lede`, `PHASE_COPY.practices.blurb` and `setupPrompt` stopped naming the conventions file
 * on 2026-09-17**, ahead of the pin that makes it false rather than after it. personal-config's
 * track questions (setup-tracks `DESIGN.md` D1, D3, §3.1) mean a visitor whose work is not code
 * is asked none of the eleven code-convention questions, and the two policy questions they *are*
 * asked carry `target: 'policy'` — so no conventions file is written for that reader at all.
 * "The house rules" names what is written without promising a file, and is true of all four
 * render shapes. Rejected: *"the documents your agent reads"*, true everywhere but giving up the
 * concreteness that makes the sentence worth reading; and branching the copy on the visitor's
 * own answers, which this island could do since it holds them, but which is a build of its own
 * and waits on the `0.3.0` pin.
 */
export const PAGE = {
  title: 'Set up how you work',
  ogTitle: 'Set up how you work — personal-config',
  description: `${ASKED_COUNT} questions about how you like to work, and a configured project back in one click.`,
  eyebrow: 'PERSONAL-CONFIG',
  heading: "Let's set up how you work",
  // The count is the questions asked before any answer opens a conditional one, so the clause
  // that follows names the rest without promising a second number — "a couple" was true of one
  // catalog and would quietly stop being true of the next.
  lede: `${ASKED_COUNT} questions about how you like to work, and the odd extra one where your answers call for it. At the end, one click writes the answers into your projects — the CLAUDE.md, the working standard and the house rules your agent reads before it touches anything.`,
  reassurance:
    'No account, and nothing is stored until you reach the end. Your answers become a link that only you have.',
  noscript: `The survey needs JavaScript. If you would rather not turn it on, run npx personal-config setup in a terminal — it asks the same ${ASKED_COUNT} questions there.`,
} as const;

export const PHASE_COPY: Record<Phase, { eyebrow: string; name: string; blurb: string }> = {
  you: {
    eyebrow: 'PART 1 OF 3',
    name: 'How you work',
    blurb: 'Commits, models, docs, hooks. These follow you into every project.',
  },
  discover: {
    eyebrow: 'PART 2 OF 3',
    name: 'Where your work lives',
    blurb: 'Which projects, how work arrives in them, and where it goes once it is done.',
  },
  practices: {
    eyebrow: 'PART 3 OF 3',
    name: 'House rules',
    blurb: 'The rules your agent follows without being asked.',
  },
};

/**
 * Concrete examples for the seven text questions, keyed by `configKey`.
 *
 * The catalog's own `placeholder` describes the *kind* of answer — *"a top reasoning model,
 * named as your harness names it"* — which is right for a terminal, where the wizard can say
 * more around it, and leaves a visitor here guessing at the shape of the string. These name
 * actual answers, and they sit under the field rather than in the placeholder so they survive
 * the first keystroke, which is when you want them.
 *
 * Site copy, not catalog copy: D6 pins `catalog.json`, and nothing here edits or shadows it.
 * A question with no entry simply gets no hint.
 */
export const INPUT_EXAMPLES: Record<string, string> = {
  'models.deep': 'Fable 5.1, Opus 5 — or whatever your harness calls its strongest',
  'models.default': 'Opus 5, Sonnet 5',
  'models.fast': 'Sonnet 5, Haiku 4.5',
  docsMcp: 'Context7 MCP, or none',
  projectsDir: '~/Projects, ~/code, ~/src',
  tracker: 'GitHub Issues, Linear, Jira',
};

// `archiveHome` deliberately has no entry: its catalog placeholder already names two concrete
// answers, and a hint underneath would be the same sentence twice on one screen.

export const SURVEY = {
  readMore: 'Read more',
  readLess: 'Close',
  back: '← Back',
  next: 'Next',
  finish: 'Finish',
  saving: 'Saving your answers…',
  errorHeading: "That didn't save.",
  errorBody: 'Your answers are all still here — nothing was lost. Try again in a moment.',
  retry: 'Try again',
  copy: 'Copy',
  copied: 'Copied',
} as const;

/** DIAL-2 — the result page, and the three rungs of D7 in their fixed order. */
export const RESULT = {
  eyebrow: 'DONE',
  heading: "That's everything.",
  lede: 'Keep this link if you want to come back to your answers. Below are three ways to use them, and they all end in the same place.',

  oneEyebrow: 'THE ONE CLICK',
  oneLabel: 'Open in Claude Code',
  oneNote:
    'Opens a terminal with the prompt already typed. Nothing is sent until you press Enter, so you can read it first.',
  oneFallback:
    'If the button does nothing, Claude Code has not registered the link handler on this machine yet — it does that the first time you send a prompt in an interactive session. Use one of the two below instead.',

  twoEyebrow: 'OR PASTE THIS',
  twoLabel: 'Run it from your terminal',
  twoNote: 'The same prompt, no handler needed — anywhere Claude Code is installed.',

  threeEyebrow: 'OR TAKE THE FILE',
  threeLabel: 'Skip Claude Code entirely',
  threeDownload: 'Download profile.json',
  threeNote:
    'Run this next to the file you just downloaded. It needs Node 20 or newer, and nothing else — the survey answers travel in the file.',
} as const;

/**
 * The prompt rungs 1 and 2 both hand to Claude Code — one string, so the two rungs cannot drift
 * into saying different things.
 *
 * Three constraints shape it, all verified 2026-09-16 at code.claude.com/docs/en/deep-links:
 * it stays well under 1,000 characters, above which the external-link warning escalates to a
 * scroll-and-review notice; it points at the stored profile rather than inlining thirty
 * answers, which is what keeps it under that; and it is **one line with no double quotes and
 * no backticks**, because rung 2 wraps this same string in `claude "…"` and a shell would eat
 * both.
 */
export function setupPrompt(id: string, origin: string): string {
  return [
    `I just answered the personal-config survey on ${host(origin)} and I'd like you to set my projects up from those answers.`,
    `Run: npx personal-config setup --from ${id}`,
    `— it reads my answers from ${origin}/p/${id} and writes a CLAUDE.md, a working standard and the house rules I picked into each project it finds.`,
    'It prints a plan before it writes anything, so walk me through that plan first, and stop if it wants to overwrite something I would miss.',
  ].join(' ');
}

function host(origin: string): string {
  return origin.replace(/^https?:\/\//, '');
}
