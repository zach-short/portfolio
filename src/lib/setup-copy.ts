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
 */

/** DIAL-4 — the `/setup` page. `title` is also the `<title>` and the OG title, via Base.astro. */
export const PAGE = {
  title: 'Set up your repo',
  description:
    'Thirty questions about how you like to work, and a configured repo back in one click.',
  eyebrow: 'PERSONAL-CONFIG',
  heading: "Let's set up your repo",
  // "Thirty" is the catalog's count, and a couple of them are conditional — a solo repo never
  // sees the tracker question — so the sentence says so rather than promising a number the
  // progress counter then contradicts.
  lede: 'Thirty questions about how you like to work, and a couple you will only see if they apply to you. At the end, one click writes the answers into your repos — the CLAUDE.md, the working standard and the conventions file your agent reads before it touches anything.',
  reassurance:
    'No account, and nothing is stored until you reach the end. Your answers become a link that only you have.',
  noscript:
    'The survey needs JavaScript. If you would rather not turn it on, run bunx personal-config setup in a terminal — it asks the same thirty questions there.',
} as const;

export const PHASE_COPY: Record<Phase, { eyebrow: string; name: string; blurb: string }> = {
  you: {
    eyebrow: 'PART 1 OF 3',
    name: 'How you work',
    blurb: 'Commits, models, docs, hooks. These follow you into every repo.',
  },
  discover: {
    eyebrow: 'PART 2 OF 3',
    name: 'Where your work lives',
    blurb: 'Which repos, how work arrives in them, and where it goes once it is done.',
  },
  practices: {
    eyebrow: 'PART 3 OF 3',
    name: 'House rules',
    blurb: 'The conventions your agent reads before it writes a line.',
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
  archiveHome: '~/Projects/archive/<repo>, or docs/archive to keep it in the repo',
  tracker: 'GitHub Issues, Linear, Jira',
};

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
    'Run this next to the file you just downloaded. It needs Bun, and nothing else — the survey answers travel in the file.',
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
    `I just answered the personal-config survey on ${host(origin)} and I'd like you to set my repos up from those answers.`,
    `Run: bunx personal-config setup --from ${id}`,
    `— it reads my answers from ${origin}/p/${id} and writes a CLAUDE.md, a working standard and a conventions file into each repo it finds.`,
    'It prints a plan before it writes anything, so walk me through that plan first, and stop if it wants to overwrite something I would miss.',
  ].join(' ');
}

function host(origin: string): string {
  return origin.replace(/^https?:\/\//, '');
}
