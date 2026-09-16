/**
 * The 28 long forms arrive as markdown bodies inside `catalog.json` (D6), and they are parsed
 * into blocks rather than into HTML on purpose: the island renders the result as Preact nodes,
 * so nothing ever reaches `dangerouslySetInnerHTML` and the `<repo>` placeholders that appear
 * in several bodies escape themselves.
 *
 * The grammar is only what the bodies actually use, counted 2026-09-16 across all 28: 28 `#`
 * headings, 134 `##`, 13 `- ` bullets, paragraphs, and inline `**bold**`, `*italic*` and
 * `` `code` ``. No links, no fences, no tables, no block quotes — so none are parsed, and a
 * body that later grows one renders as plain text rather than as broken markup.
 */
export type Inline = { kind: 'text' | 'bold' | 'italic' | 'code'; text: string };

export type Block =
  | { kind: 'heading'; level: 1 | 2; spans: Inline[] }
  | { kind: 'paragraph'; spans: Inline[] }
  | { kind: 'list'; items: Inline[][] };

export function parseLongForm(body: string): Block[] {
  return body
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map(toBlock);
}

function toBlock(chunk: string): Block {
  const heading = chunk.match(/^(#{1,2}) (.*)$/);
  if (heading) return { kind: 'heading', level: headingLevel(heading[1]), spans: parseInline(heading[2]) };
  const lines = chunk.split('\n');
  if (lines.every((line) => line.startsWith('- '))) {
    return { kind: 'list', items: lines.map((line) => parseInline(line.slice(2))) };
  }
  // Markdown hard-wraps at ~95 columns here, so a paragraph's own newlines are not breaks.
  return { kind: 'paragraph', spans: parseInline(lines.join(' ')) };
}

function headingLevel(hashes: string): 1 | 2 {
  return hashes.length === 1 ? 1 : 2;
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;

/**
 * Also used for a question's `ask` and its options' `label` and `example`. Those are markdown
 * too — the terminal wizard renders `` `git commit` `` as a code span — so a browser that
 * printed the backticks would be showing the source rather than the question.
 */
export function parseInline(text: string): Inline[] {
  return text
    .split(INLINE)
    .filter((piece) => piece.length > 0)
    .map(toSpan);
}

function toSpan(piece: string): Inline {
  if (piece.startsWith('**') && piece.endsWith('**')) return strip('bold', piece, 2);
  if (piece.startsWith('`') && piece.endsWith('`')) return strip('code', piece, 1);
  if (piece.startsWith('*') && piece.endsWith('*')) return strip('italic', piece, 1);
  return { kind: 'text', text: piece };
}

function strip(kind: Inline['kind'], piece: string, marker: number): Inline {
  return { kind, text: piece.slice(marker, -marker) };
}
