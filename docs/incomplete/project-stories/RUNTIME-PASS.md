# Project stories — RUNTIME-PASS

What a person has to look at, because no gate here can. One entry per surface: **goal**, **where**,
**the right answer**. Started 2026-09-16 by P1; P2 and P3 append, P4 collates and closes.

A green `bun run build` in this repo means *it compiled and every content file imported* — nothing
more (`CLAUDE.md`, *Gates that lie*). Everything below is outside that.

Run against the worktree, not the primary tree:

```bash
cd /Users/zachshort/Projects/portfolio/.claude/worktrees/item10-stories && bunx astro dev --port 4331
```

---

## P1 — `/projects/furlough`

**Status 2026-09-16: NOT WALKED.** P1 could not start a dev server against this worktree — see
`HANDOFF.md` step 16, *The one thing P1 could not do*. Every entry below is therefore owed, and
the ones marked *(computed)* have an arithmetic or `dist/` answer already, which the walk is
confirming rather than discovering.

### 1. The five frames advance, and the screen follows

- **Goal.** Scrolling changes which screen is on the phone, once per frame, in order.
- **Where.** `http://localhost:4331/projects/furlough` at a desktop width (≥ 860 px).
- **Right answer.** Five frames. As each headline reaches the middle of the viewport its screen
  cross-fades in over 0.45 s. Order: the Furlough home (hourglass, Instagram countdown) → the
  Anchor screen (anchor icon, five held app icons) → the Rule screen showing **60 MIN** → the
  delay screen → the grey block screen whose only button is **Close**. Nothing flickers between
  two screens at a frame boundary, and no frame leaves the phone blank.

### 2. The tilt sweeps, and the line draws

- **Goal.** D2's "rotating" is visible, and the line tracks the reader.
- **Where.** Same page, same width.
- **Right answer.** The phone is tilted right on frame 1, square on frame 3, tilted left on
  frame 5 — a sweep from +12° to −12°, not a jump. The teal line in the column gap is drawn from
  the top down to the current frame's dot; dots behind the reader are bright, dots ahead are
  dim. In Chrome the draw is continuous with the scroll; in Firefox it steps frame to frame.
  Both are correct — see entry 6.

### 3. The CTA goes to the App Store

- **Goal.** The one outbound link on the page is right.
- **Where.** The button under the phone, labelled **On the App Store ↗**.
- **Right answer.** It opens `https://apps.apple.com/app/id6810006594` in a new tab, landing on
  Furlough's App Store page. *(computed: the href is in `dist/client/projects/furlough/index.html`
  and the URL returned 200 to curl on 2026-09-16.)*

### 4. The phone does not eat the copy at 375×812

- **Goal.** DESIGN §5 H6 — the mobile room question, the one real risk in this layout.
- **Where.** Same page at 375×812.
- **Right answer.** The phone sticks below the nav at 40 vh (≈ 325 px) tall and ≈ 149 px wide.
  Each frame's eyebrow, headline **and** sub-line are fully visible *below* the phone at the
  moment that frame goes active — no line of copy is behind the phone, and nothing needs a
  second scroll to finish reading. **Report the pixel room**: the gap between the phone's bottom
  edge and the bottom of the viewport. *(computed: ≈ 411 px available against ≈ 203 px of copy.
  The frame's top padding that produces this is derived in `ProjectStory.astro`, not tuned by
  eye — so this entry is the one most worth actually looking at.)*

### 5. Without JavaScript, nothing is lost but the screens

- **Goal.** BD-5 holds.
- **Where.** Same page, JS disabled.
- **Right answer.** The phone shows frame 1's screen. All five eyebrows, headlines and sub-lines
  are visible and at full opacity — not dimmed. The CTA still links out. *(computed: all fifteen
  strings are in the static HTML, and the dim rule is keyed on `[data-active]`, which only the
  script adds.)*

### 6. The Firefox baseline

- **Goal.** The `@supports (animation-timeline: scroll())` block is an enhancement, never the
  mechanism.
- **Where.** Same page in Firefox (or Chrome with that block commented out).
- **Right answer.** The line still advances — in five steps rather than continuously — and every
  other behaviour is identical. *(computed: the stepped rule is emitted outside the `@supports`
  block in `dist/client/_astro/_slug_*.css`.)*

### 7. Reduced motion

- **Goal.** The third of the three layers actually engages. **The OS toggle is Zach's to flip;
  P1 verified this in `dist/`, not on screen.**
- **Where.** Same page with System Settings → Accessibility → Display → Reduce motion on.
- **Right answer.** Screens swap instantly, the phone sits square (no tilt, ever), and the line
  is drawn full length from the start. Nothing animates. *(computed: the emitted CSS carries
  `@media (prefers-reduced-motion:reduce){.phone{--ry:0deg;transition:none;transform:none} …
  .line-path{stroke-dashoffset:0;transition:none;animation:none}}`.)*

### 8. Observer hygiene across navigation

- **Goal.** The `ClientRouter` does not leave observers running.
- **Where.** `/` → `/projects/furlough` → back → `/projects/furlough`, console open.
- **Right answer.** The console is clean and the frames still advance on the second visit — the
  observer is re-armed per visit, not stacked. Nothing throws on the pages that have no story.

---

## P2 — `/projects/ezhomesteading`, `/projects/emoney`

*Appended by P2.*

## P3 — `/`

*Appended by P3.*
