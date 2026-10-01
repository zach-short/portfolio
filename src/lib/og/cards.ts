import { getCollection, type CollectionEntry } from 'astro:content';

import { formatSlug } from '@/src/lib/format-slug';
import type { Card } from '@/src/lib/og/card';
import { firstSentence } from '@/src/lib/og/text';
import { hasStory, projects, type Project } from '@/src/lib/projects';
import { PAGE } from '@/src/lib/setup-copy';
import { site } from '@/src/site';

type Post = CollectionEntry<'leetcode'>;

// A capture's file on disk. Astro serves an imported image as a Proxy whose `get` trap answers
// `fsPath` and whose `has` trap does not, so an `in` check says no where a read says yes. Its own
// types leave the property out. The render step needs the original, not the hashed copy the page
// serves, and a `/_astro/` URL does not exist yet when this list is built.
function screenFile(project: Project): string {
  const { fsPath } = project.frames[0].screen as ImageMetadata & { fsPath?: string };
  if (fsPath) return fsPath;
  throw new Error(`og cards: no file path on the first screen of "${project.slug}"`);
}

const titleCase = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

function homeCard(): Card {
  const withStory = projects.filter(hasStory);
  return {
    path: '/',
    eyebrow: site.name,
    // The h1 in `pages/index.astro`. Kept in step by hand: the page's copy is not importable.
    title: "Hi, I'm Zach. I build things people actually use.",
    chips: projects.map((project) => project.title),
    screens: withStory.slice(0, 2).map(screenFile),
  };
}

function projectCard(project: Project): Card {
  return {
    path: `/projects/${project.slug}`,
    eyebrow: 'Project',
    title: project.title,
    blurb: firstSentence(project.blurb),
    chips: project.tech,
    screens: [screenFile(project)],
  };
}

function postCard(post: Post): Card {
  const { leetcodeNumber, difficulty, languages, tags, complexity } = post.data;
  return {
    path: `/blog/leetcode/${post.id}`,
    eyebrow: `LeetCode · #${leetcodeNumber} · ${titleCase(difficulty)}`,
    title: post.data.title ?? formatSlug(post.id),
    mono: complexity ? `${complexity.time} time · ${complexity.space} space` : undefined,
    chips: [...languages, ...tags],
    figure: String(leetcodeNumber),
  };
}

function leetcodeIndexCard(posts: Post[]): Card {
  const count = (level: string) => posts.filter((post) => post.data.difficulty === level).length;
  return {
    path: '/blog/leetcode',
    eyebrow: 'Blog · LeetCode',
    title: 'LeetCode Solutions',
    blurb: `${posts.length} problems solved and written up.`,
    chips: ['easy', 'medium', 'hard'].map((level) => `${count(level)} ${level}`),
    figure: String(posts.length),
  };
}

const blogCard: Card = {
  path: '/blog',
  eyebrow: 'Blog',
  title: 'Blog',
  blurb: 'LeetCode solutions and write-ups.',
};

const setupCard: Card = {
  path: '/setup',
  eyebrow: PAGE.eyebrow,
  title: PAGE.title,
  blurb: PAGE.lede,
  // The command `PAGE.noscript` tells a visitor to run when they would rather skip the page.
  mono: 'npx personal-config setup',
};

/**
 * Every page that has a share image, as data. This is the one list: the endpoint serialises it
 * for the build step, which renders each entry and then checks every built page against the
 * files it wrote, so a page missing from here fails the build rather than shipping a broken link.
 */
export async function getCards(): Promise<Card[]> {
  const posts = await getCollection('leetcode');
  return [
    homeCard(),
    setupCard,
    blogCard,
    leetcodeIndexCard(posts),
    ...posts.map(postCard),
    ...projects.filter(hasStory).map(projectCard),
  ];
}
