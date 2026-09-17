import { setupPrompt } from '@/src/lib/setup-copy';

/**
 * The three rungs of D7, as strings. One module so that the prompt is built once and the three
 * cannot disagree about what they are asking Claude Code to do.
 *
 * I6 re-verified 2026-09-16 at code.claude.com/docs/en/deep-links, and it moved in two places
 * worth writing down. The warning under the input box now reads `Prompt from an external link`
 * on **every** deep link, not only long ones; what 1,000 characters crosses is an *escalation*
 * of that warning to a character count and a scroll-and-review instruction. And `q` is capped
 * at 5,000 characters. The two facts D7 rests on are unchanged: the prompt is populated and
 * **not sent** until Enter, and the handler registers only when you send your first prompt of
 * an interactive session — so rungs 2 and 3 stay mandatory, not decorative.
 */
export type Rungs = {
  deepLink: string;
  claudeCommand: string;
  setupCommand: string;
  promptLength: number;
  profileUrl: string;
};

/**
 * Deliberately no `repo=` and no `cwd=` on the deep link. `repo` resolves only against clones
 * Claude Code has already recorded on that machine, and a stranger's repo is the one thing this
 * page cannot know; `cwd` needs an absolute path for the same reason. Without either, the
 * session opens in the person's home directory — which is where `setup` scans from anyway,
 * since the directory it scans is one of the thirty answers.
 */
export function rungsFor(id: string, origin: string): Rungs {
  const prompt = setupPrompt(id, origin);
  return {
    deepLink: `claude-cli://open?q=${encodeURIComponent(prompt)}`,
    claudeCommand: `claude "${prompt}"`,
    // `npx`, not `bunx` — the reason is in `setup-copy.ts`'s module comment.
    setupCommand: 'npx personal-config setup --from ./profile.json',
    promptLength: prompt.length,
    profileUrl: `${origin}/p/${id}`,
  };
}
