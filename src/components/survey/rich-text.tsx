/** @jsxImportSource preact */
import { parseInline, type Inline } from '@/src/lib/long-form';

/**
 * One line of the catalog's markdown, as nodes.
 *
 * Every string the catalog carries is markdown, not plain text — question asks, option labels
 * and examples all use `` `code` `` and `**bold**`, because the terminal wizard renders them.
 * A browser printing the source instead would be showing a visitor the backticks.
 */
export function RichText({ text }: { text: string }) {
  return <Spans spans={parseInline(text)} />;
}

/** The same, for callers that already parsed — the long form parses blocks before spans. */
export function Spans({ spans }: { spans: Inline[] }) {
  return <>{spans.map(renderSpan)}</>;
}

function renderSpan(span: Inline, index: number) {
  if (span.kind === 'bold') return <strong key={index}>{span.text}</strong>;
  if (span.kind === 'italic') return <em key={index}>{span.text}</em>;
  if (span.kind === 'code') return <code key={index}>{span.text}</code>;
  return <span key={index}>{span.text}</span>;
}
