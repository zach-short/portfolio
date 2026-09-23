import type { Phase } from '@/src/lib/catalog';

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
 * `ASKED_COUNT` lived here and is gone, removed 2026-09-22 (`personal-config` PASSOFF row 57).
 *
 * It counted the questions asked from one fixed starting point (`askedQuestions(
 * defaultAnswers())`), computed once at module scope. `survey.tsx`'s own counter
 * (`total={askedQuestions(answers).length}`, `:101`) is computed the same way but over *live*
 * answers, so the two diverge the moment a track question is answered — the derivation this
 * comment used to defend ("the sentence and the counter cannot disagree") stopped being true
 * the day the catalog grew track questions, and nobody caught it because nothing re-ran the
 * comparison. Observed live 2026-09-22: `1 / 33` on screen one, `2 / 22` after "Other work",
 * `4 / 21` after also "No, just folders" — three different truths for one module-scope number.
 *
 * A range was rejected too, not just a fixed count: the pinned `0.3.0` catalog's own spread is
 * 21–34 depending on track, and HEAD's unpublished catalog at the time moves that to 18–35 — a
 * range is exactly as fragile as a fixed number, just on a longer timescale.
 *
 * **Do not reintroduce a count or a range here.** If a screen ever needs a live number again,
 * take it from `askedQuestions(answers)` inside the survey island the way `survey.tsx:101`
 * already does — never from a module-scope constant, and never for `PAGE.lede`, `.description`
 * or `.noscript`, which render in the static Astro shell (`src/pages/setup.astro:11-16,24`),
 * outside `<Survey client:load />`, and so can never read live answer state at all.
 */

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
 * own answers — corrected below, 2026-09-22, on why that one actually loses.
 *
 * **A second correction, 2026-09-22 (`personal-config` PASSOFF row 57).** `lede`, `description`
 * and `noscript` stopped naming a question count at all, for the same reason `ASKED_COUNT` was
 * removed (see the note above `PAGE`, where it used to live). Two alternatives were considered
 * and both lose:
 *
 * - **A range** ("21 to 34 questions") reads honestly today, but it is exactly as fragile as the
 *   fixed count it would replace, just on a longer timescale — the pinned `0.3.0` catalog's own
 *   spread is 21–34 depending on track, and it moved to 18–35 under a catalog change already
 *   sitting unpublished at the time this was fixed. A range is a number with a shorter
 *   expiration date, not a fix.
 * - **Branching the copy on the visitor's own answers** was previously recorded here as
 *   "considered and deferred, blocked on the `0.3.0` pin" — that blocker is gone, and the note
 *   was wrong regardless of the pin. `lede`, `description` and `noscript` all render in the
 *   static Astro shell (`src/pages/setup.astro:11-16,24`), **outside**
 *   `<Survey client:load />` (`:22`). Branching them on live answers would mean moving that
 *   paragraph into the island itself — a different page structure, not a copy edit — and even
 *   then, `description` is a `<meta>` tag read by crawlers that never run JS and `noscript` is
 *   read only when JS is off: neither can execute the island's branching logic under any
 *   circumstance, so branching would not fix those two consumers at all, no matter where the
 *   lede itself moved.
 *
 * The number-free phrasing below is what survives both rejections: true of every track, without
 * a number that drifts or a fallback that two of the three consumers could never run.
 */
export const PAGE = {
  title: 'Set up how you work',
  ogTitle: 'Set up how you work — personal-config',
  description:
    'A short survey about how you like to work, then one click writes a CLAUDE.md, a working standard and the house rules into your project.',
  eyebrow: 'PERSONAL-CONFIG',
  heading: "Let's set up how you work",
  lede: 'A short survey about how you like to work, and a configured project back in one click.',
  reassurance:
    'No account, and nothing is stored until you reach the end. Your answers become a link that only you have.',
  noscript:
    'The survey needs JavaScript. If you would rather not turn it on, run npx personal-config setup in a terminal — it walks the same questions there.',
} as const;

export const PHASE_COPY: Record<Phase, { eyebrow: string; name: string; blurb: string }> = {
  you: {
    eyebrow: 'PART 1 OF 3',
    name: 'How you work',
    blurb:
      "What's true of you, in every project: how commits happen, which models do what, and what gets enforced automatically.",
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
