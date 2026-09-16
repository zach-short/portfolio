// The one description of a project on this site (PLAN.md BD-3). The home page and the story
// page both read it; nothing else describes a project. Every string here is verbatim from
// docs/incomplete/project-stories/DESIGN.md §7.2 and §7.3 — R7: the copy is final, and a word
// that reads wrong is asked about rather than re-picked here.
import furlough01 from '@/src/assets/projects/furlough/01.png';
import furlough02 from '@/src/assets/projects/furlough/02.png';
import furlough03 from '@/src/assets/projects/furlough/03.png';
import furlough04 from '@/src/assets/projects/furlough/04.png';
import furlough05 from '@/src/assets/projects/furlough/05.png';

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
  /** Five (D8); S-1 is this array's length and is written nowhere else. */
  frames: Frame[];
}

// Furlough's five are frames 1, 2, 6, 8 and 10 of its ten (D8), renumbered 01–05 in source
// order. P2 adds EZHomesteading and E-Money to this array.
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

export const projects: Project[] = [furlough];

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
