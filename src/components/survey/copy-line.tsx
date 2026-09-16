/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { SURVEY } from '@/src/lib/setup-copy';

type Props = { command: string; label: string };

/**
 * A command with a copy button. Rungs 2 and 3 are both "a line you paste into a terminal", and
 * a line long enough to be useful is long enough that nobody should be selecting it by hand on
 * a phone — which is exactly the visitor rung 1 has already failed for.
 */
export function CopyLine({ command, label }: Props) {
  const [copied, setCopied] = useState(false);

  // The clipboard rejects outside a secure context and under some permission policies. The
  // command is on screen either way, so a refusal leaves it selectable rather than claiming a
  // copy that did not happen.
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div class="survey-copy">
      <pre class="survey-command" aria-label={label}><code>{command}</code></pre>
      <button type="button" class="glass survey-copy-button" onClick={copy}>
        {copied ? SURVEY.copied : SURVEY.copy}
      </button>
    </div>
  );
}
