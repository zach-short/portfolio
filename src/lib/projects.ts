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
  link: string;
  /** Per project, because Furlough's link is a store page and not a site — Zach, 2026-09-16. */
  linkLabel: string;
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

// Module order is card order (D5).
export const projects: Project[] = [furlough, ezhomesteading, emoney];

export function hasStory(project: Project): boolean {
  return project.frames.length > 0;
}

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
