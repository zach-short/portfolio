/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { longFormFor } from '@/src/lib/catalog';
import { parseLongForm, type Block } from '@/src/lib/long-form';
import { SURVEY } from '@/src/lib/setup-copy';
import { Spans } from '@/src/components/survey/rich-text';

type Props = { readMore: string };

/**
 * The long form behind a question, from the 28 `docs/choices/*.md` bodies the catalog carries
 * (D6, P2). Collapsed by default: the whole point of the wizard's `Read more…` is that the
 * defense is there for whoever wants it and out of the way for whoever does not.
 */
export function ReadMore({ readMore }: Props) {
  const [open, setOpen] = useState(false);
  const body = longFormFor(readMore);
  if (body === undefined) return null;

  return (
    <div class="survey-more">
      <button type="button" class="survey-more-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? SURVEY.readLess : SURVEY.readMore}
      </button>
      {open && <div class="prose survey-long">{parseLongForm(body).map(renderBlock)}</div>}
    </div>
  );
}

function renderBlock(block: Block, index: number) {
  if (block.kind === 'list') {
    return (
      <ul key={index}>
        {block.items.map((item, i) => (
          <li key={i}><Spans spans={item} /></li>
        ))}
      </ul>
    );
  }
  // The bodies open with an `#` title that repeats the question, so every heading renders as an
  // h3 — the panel already sits under the question's own h2 and must not outrank it.
  if (block.kind === 'heading') return <h3 key={index}><Spans spans={block.spans} /></h3>;
  return <p key={index}><Spans spans={block.spans} /></p>;
}
