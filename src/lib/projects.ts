// The one description of a project on this site (PLAN.md BD-3). The home page and the story
// page both read it; nothing else describes a project. Every string here is verbatim from
// docs/incomplete/project-stories/DESIGN.md §7.2 and §7.3 — R7: the copy is final, and a word
// that reads wrong is asked about rather than re-picked here.
import furlough01 from '@/src/assets/projects/furlough/01.png';
import furlough02 from '@/src/assets/projects/furlough/02.png';
import furlough03 from '@/src/assets/projects/furlough/03.png';
import furlough04 from '@/src/assets/projects/furlough/04.png';
import furlough05 from '@/src/assets/projects/furlough/05.png';
import ezh01 from '@/src/assets/projects/ezhomesteading/01.png';
import ezh02 from '@/src/assets/projects/ezhomesteading/02.png';
import ezh03 from '@/src/assets/projects/ezhomesteading/03.png';
import ezh04 from '@/src/assets/projects/ezhomesteading/04.png';
import pdfmailer01 from '@/src/assets/projects/pdfmailer/01.png';
import pdfmailer02 from '@/src/assets/projects/pdfmailer/02.png';
import pdfmailer03 from '@/src/assets/projects/pdfmailer/03.png';
import pdfmailer04 from '@/src/assets/projects/pdfmailer/04.png';
import pdfmailer05 from '@/src/assets/projects/pdfmailer/05.png';
import wk01 from '@/src/assets/projects/wk/01.png';
import wk02 from '@/src/assets/projects/wk/02.png';
import wk03 from '@/src/assets/projects/wk/03.png';
import wk04 from '@/src/assets/projects/wk/04.png';
import wk05 from '@/src/assets/projects/wk/05.png';
import pc01 from '@/src/assets/projects/personal-config/01.png';
import pc02 from '@/src/assets/projects/personal-config/02.png';
import pc03 from '@/src/assets/projects/personal-config/03.png';
import pc04 from '@/src/assets/projects/personal-config/04.png';
import pc05 from '@/src/assets/projects/personal-config/05.png';

/** One panel of a story: the copy on the left, the screen that proves it on the phone. */
export interface Frame {
  eyebrow: string;
  headline: string;
  sub: string;
  /** A real capture of the product (D4). Its `alt` is the headline — BD-8. */
  screen: ImageMetadata;
}

export interface Project {
  /** Published at `/projects/<slug>` the moment Zach deploys, and only redirectable after — BD-2. */
  slug: string;
  title: string;
  blurb: string;
  tech: string[];
  /**
   * Where a reader can get the thing. Optional since 2026-10-16 because wk has no public home
   * yet (its repo is private), and a link a reader cannot open is worse than none.
   */
  link?: string;
  /** Per project, because Furlough's link is a store page and not a site — Zach, 2026-09-16. */
  linkLabel?: string;
  /** The public source repository, shown on the story page beside the main link. */
  source?: string;
  /**
   * The story's own path when it is not `/projects/<slug>`. wk answers at `/wk`, and
   * personal-config's story heads the page that was `/setup`, which also carries the survey.
   */
  page?: string;
  /**
   * Five (D8); S-1 is this array's length and is written nowhere else. Empty means the story
   * is not built yet: the project gets a home-page card and no `/projects/<slug>` page.
   */
  frames: Frame[];
}

// Furlough's five are frames 1, 2, 6, 8 and 10 of its ten (D8), renumbered 01–05 in source
// order.
const furlough: Project = {
  slug: 'furlough',
  title: 'Furlough',
  blurb:
    'The app blocker with no unblock button. Loosening a rule waits a day; the Anchor waits for a tag you left at home. On the App Store since September 2026, with a Mac app that locks with it.',
  tech: ['Swift', 'iOS', 'macOS'],
  link: 'https://apps.apple.com/app/id6810006594',
  linkLabel: 'On the App Store',
  frames: [
    {
      eyebrow: 'The rule',
      headline: 'No unblock button.',
      sub: 'Pick the apps that eat your time. Furlough shields them when the time is gone.',
      screen: furlough01,
    },
    {
      eyebrow: 'The Anchor',
      headline: 'Locked till you tap the tag.',
      sub: 'One tap locks. Only the NFC tag you paired releases it. Leave the tag at home.',
      screen: furlough02,
    },
    {
      eyebrow: 'Budgets',
      headline: "Sixty minutes. Then it's gone.",
      sub: 'Give every app a daily budget. Spend it whenever you like.',
      screen: furlough03,
    },
    {
      eyebrow: 'The delay',
      headline: 'Loosening waits a day.',
      sub: 'Tightening is instant. Loosening waits out the delay you set. You can cancel it while it waits.',
      screen: furlough04,
    },
    {
      eyebrow: 'The shield',
      headline: 'Nothing to tap but Close.',
      sub: 'The block screen says which app is closed and what would open it. That is the whole conversation.',
      screen: furlough05,
    },
  ],
};

// EZHomesteading ships **four** frames, not five. DESIGN §7.4's fallback 4' — "A neighborhood
// stand", whose sub-line ends "and whatever the growers around them dropped off" — was cut by
// Zach on 2026-09-16 after P2 walked all eight store pages reachable from the market feed and
// found every listing on each one attributed to that store itself: nothing public shows a
// stand carrying another grower's goods, and PLAN §5 H2 says a claim that fails its check is
// cut, never softened. The evidence is PLAN.md §5.1; it is not restated here, because G12 bans
// this file from carrying the two words the stores' own badges use. Recorded as an `As built:`
// under D4, which already allows a four-frame story. The surviving fallbacks keep their design
// numbers in the docs (3', 5') and ship here as frames 3 and 4.
const ezhomesteading: Project = {
  slug: 'ezhomesteading',
  title: 'EZHomesteading',
  blurb:
    'Food from down the road: a backyard grower drops off surplus, a neighborhood stand sells it, you pick it up on your route. Web and native, on a Go backend.',
  // DESIGN §7.2's table, which the blurb's "on a Go backend" agrees with. Its note calls these
  // "the existing ones (src/pages/index.astro:12,18)" and that note is wrong about line 12,
  // which still reads MongoDB — the table is the copy, so the table wins. Raised, not fixed.
  tech: ['Next.js', 'Expo', 'Go'],
  link: 'https://ezhomesteading.com',
  linkLabel: 'Go to site',
  frames: [
    {
      eyebrow: 'The idea',
      headline: 'Sold by the hands that grew it.',
      sub: 'Someone near you has more tomatoes than they can eat. A stand down the road sells them. You pick them up on the way home.',
      screen: ezh01,
    },
    {
      eyebrow: 'The market',
      headline: "Set your area. See what's ripe.",
      sub: "A home base and how far you'll go; the feed shows the stands inside it before anything outside.",
      screen: ezh02,
    },
    {
      eyebrow: 'The listing',
      headline: 'It says who grew it.',
      sub: 'Every listing names the grower and the place. No warehouse, no truck, no distributor between you.',
      screen: ezh03,
    },
    {
      eyebrow: 'The surplus',
      headline: 'Got more than you can eat?',
      sub: 'List it in a minute — a photo, a price, a pickup place — and let the stand do the selling.',
      screen: ezh04,
    },
  ],
};

// E-Money's story is owed: P2 stopped short of its captures (HANDOFF step 19), and Zach is
// adding them himself. Until then it is a card with no frames, so the home page still shows
// all three the hero promises, and no half-built story page is published under a slug that
// becomes permanent on the first deploy (BD-2). Adding its five frames here is the whole
// change that turns the card into a full one and builds `/projects/emoney`.
const emoney: Project = {
  slug: 'emoney',
  title: 'E-Money',
  blurb:
    'A Monopoly bank that never runs out of bills — built after a real bank run five hours into a game. One room code, every phone at the table, every payment live.',
  tech: ['Go', 'WebSocket', 'Next.js'],
  link: 'https://emoney.club',
  linkLabel: 'Go to site',
  frames: [],
};

// PDF Mailer was added 2026-10-05 and is the one project here whose copy was picked in chat, not
// read from DESIGN §7: Zach chose the plain register for the blurb and the headlines. Its five
// captures are of the app running on localhost against a local Supabase, signed in as a test
// account with made-up addresses and a generated PDF — nothing in them is a real person's data.
// The slug has no hyphen, like the other three, and is permanent from the first deploy (BD-2).
const pdfmailer: Project = {
  slug: 'pdfmailer',
  title: 'PDF Mailer',
  blurb:
    'Turns a PDF into the body of an email. Drop in a PDF and each page becomes an image. One click opens a message in Gmail, Outlook, Yahoo or your mail app, with the recipients filled in.',
  tech: ['Next.js', 'Supabase', 'PDF.js'],
  link: 'https://pdfmailer.app',
  linkLabel: 'Go to site',
  frames: [
    {
      eyebrow: 'The idea',
      headline: 'A PDF becomes an email.',
      sub: 'No attachment. Each page shows in the message itself.',
      screen: pdfmailer01,
    },
    {
      eyebrow: 'The preview',
      headline: 'Every page, as an image.',
      sub: 'See the finished email, with the pages in the body, before anything is saved.',
      screen: pdfmailer02,
    },
    {
      eyebrow: 'The lists',
      headline: 'Lists with To, Cc and Bcc.',
      sub: 'Save the people you write to. Each list keeps its own To, Cc and Bcc addresses.',
      screen: pdfmailer03,
    },
    {
      eyebrow: 'The send',
      headline: 'One click opens your mail app.',
      sub: 'Gmail, Outlook, Yahoo or the mail app on your computer opens with the recipients and subject filled in. Paste the email, then send.',
      screen: pdfmailer04,
    },
    {
      eyebrow: 'The sender',
      headline: 'It sends from your account.',
      sub: 'No sending service sits in between, so replies go straight to you.',
      screen: pdfmailer05,
    },
  ],
};

// wk and personal-config were added 2026-10-16. Every sentence below is checked against the
// tools themselves: wk's README and source, and personal-config's published 0.8.0 package (the
// copy in node_modules, which is what npm serves). Nothing here says why they were built or how
// well they work; that is Zach's to write. The captures are real runs against throwaway repos
// under a stand-in home folder, rendered from the terminal's own output, so no real repo, file
// content or private path is in them.
//
// wk's repo is private on 2026-10-16, so it has no `link` and no `source`. Making it public is
// one line here: `source: 'https://github.com/zach-short/wk'` (and a `link` if the CTA should
// show too).
const wk: Project = {
  slug: 'wk',
  title: 'wk',
  blurb:
    'Makes git worktrees for parallel coding agents with the dependencies already in place, cloned copy-on-write from a template instead of installed again. It also judges which worktrees are finished and removes them.',
  tech: ['Go', 'Bubble Tea', 'APFS'],
  page: '/wk',
  frames: [
    {
      eyebrow: 'The workspace',
      headline: 'One command, a warm workspace.',
      sub: 'wk new 21 adds a worktree on branch wk/21 and clones node_modules from the template. It prints only the path on stdout, so cd "$(wk new 21)" lands inside.',
      screen: wk01,
    },
    {
      eyebrow: 'Setup',
      headline: 'It reads the repo first.',
      sub: 'Run wk with no arguments and a guided setup finds the manifests, lockfiles and .env files, then asks which to use. It reads file names only, so a .env file is listed and never opened.',
      screen: wk02,
    },
    {
      eyebrow: 'The verdicts',
      headline: 'Every worktree gets a verdict.',
      sub: 'Removable, kept, skipped or prunable, with every reason behind it. wk hive draws them in the terminal and reads them again every 3 seconds.',
      screen: wk03,
    },
    {
      eyebrow: 'The hive page',
      headline: 'The same hive, in a browser.',
      sub: 'wk viz serves the view on 127.0.0.1:8787 and reads the live verdicts on every load. Both views read a dry run, so neither can remove anything.',
      screen: wk04,
    },
    {
      eyebrow: 'The cleanup',
      headline: 'It removes only what is finished.',
      sub: 'A worktree goes only when it is unlocked, idle and clean, and the base branch already holds its commits. Setup can also install a launchd agent that runs wk gc --apply every hour.',
      screen: wk05,
    },
  ],
};

// The page at `/personal-config` was the survey at `/setup` until 2026-10-16; `/setup` now
// redirects to it (astro.config.mjs). The story heads that page and the survey follows it.
const personalConfig: Project = {
  slug: 'personal-config',
  title: 'personal-config',
  blurb:
    'A terminal wizard on npm that writes an agent-driven working standard into your repos: a ledger, a board, code conventions and the rules a coding agent reads before it touches anything. Nothing is written until you have seen the whole file tree.',
  tech: ['TypeScript', 'Node', 'Bun'],
  link: 'https://www.npmjs.com/package/personal-config',
  linkLabel: 'On npm',
  source: 'https://github.com/zach-short/personal-config',
  page: '/personal-config',
  frames: [
    {
      eyebrow: 'The questions',
      headline: 'One question at a time.',
      sub: 'Each option comes with a practical example, and the recommended one is marked. Who runs git commit is one of the questions.',
      screen: pc01,
    },
    {
      eyebrow: 'Read more',
      headline: 'The case against, before you choose.',
      sub: 'Read more… prints the long form: what the option means, the strongest argument against it, what it writes and how to undo it.',
      screen: pc02,
    },
    {
      eyebrow: 'Your projects',
      headline: 'It looks before it writes.',
      sub: 'Name the folder that holds your projects. It lists the repos one level down, with the languages and package manager it found, and you pick which to set up.',
      screen: pc03,
    },
    {
      eyebrow: 'The preview',
      headline: 'Every file, before any is written.',
      sub: 'Each run prints the whole file tree and asks once for the batch. With --dry-run it writes nothing at all.',
      screen: pc04,
    },
    {
      eyebrow: 'Undo',
      headline: 'Backed up first, undone once.',
      sub: 'Anything a run overwrites is copied aside first. personal-config undo lists what it would put back, asks, then restores it.',
      screen: pc05,
    },
  ],
};

// Module order is card order (D5). The two added 2026-10-16 go last until Zach says otherwise.
export const projects: Project[] = [furlough, ezhomesteading, emoney, pdfmailer, wk, personalConfig];

export function hasStory(project: Project): boolean {
  return project.frames.length > 0;
}

/** Where a project's story is published, or nothing when it has no story yet. */
export function storyPath(project: Project): string | undefined {
  if (!hasStory(project)) return undefined;
  return project.page ?? `/projects/${project.slug}`;
}

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
