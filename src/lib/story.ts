// The whole of the story page's client behaviour (PLAN.md BD-4). It decides one thing — which
// frame the reader is on — and writes it to the root; every visible consequence is CSS
// arithmetic on those values (PLAN.md P1 step 8). Armed by the page on `astro:page-load` and
// disconnected on `astro:before-swap`, the way `Base.astro:63-77` arms the reveal.

// A zero-height root band pinned to the middle of the viewport: the only frame that intersects
// it is the one crossing the centre line, which is the definition of "active" D2 asks for. The
// plan's `threshold: 0.5` cannot do this job — against a zero-height root the intersection
// ratio never approaches 0.5, so the callback would never fire.
const MIDDLE_OF_VIEWPORT = '-50% 0px -50% 0px';

export function startStory(root: HTMLElement): () => void {
  const frames = Array.from(root.querySelectorAll<HTMLElement>('[data-frame]'));
  if (!frames.length || !('IntersectionObserver' in window)) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(root, frames.indexOf(entry.target as HTMLElement), frames.length);
      }
    },
    { rootMargin: MIDDLE_OF_VIEWPORT, threshold: 0 },
  );
  for (const frame of frames) io.observe(frame);
  return () => io.disconnect();
}

function setActive(root: HTMLElement, index: number, count: number): void {
  if (index < 0) return;
  root.dataset.active = String(index);
  // CSS cannot read a data attribute as a number, so the index is also a custom property.
  // `data-active` still earns its place: its mere presence is how the stylesheet tells a
  // scripted visit from a scriptless one (BD-5).
  root.style.setProperty('--active', String(index));
  root.style.setProperty('--progress', String(count > 1 ? index / (count - 1) : 0));
}
