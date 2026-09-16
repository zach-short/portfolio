/** @jsxImportSource preact */
import type { AnswerValue, Question } from '@/src/lib/catalog';
import { INPUT_EXAMPLES, PHASE_COPY, SURVEY } from '@/src/lib/setup-copy';
import { ReadMore } from '@/src/components/survey/read-more';
import { RichText } from '@/src/components/survey/rich-text';

type Props = {
  question: Question;
  value: AnswerValue;
  position: number;
  total: number;
  canGoBack: boolean;
  isLast: boolean;
  onAnswer: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

/** One question, the whole screen. The survey is answered on a phone, so nothing sits beside it. */
export function QuestionCard(props: Props) {
  const { question, position, total, canGoBack, isLast } = props;
  const phase = PHASE_COPY[question.phase];

  return (
    <section class="card survey-card" aria-labelledby="survey-question">
      <header class="survey-head">
        <p class="eyebrow">{phase.eyebrow} · {phase.name}</p>
        <p class="eyebrow muted mono">{position} / {total}</p>
      </header>
      <div class="survey-rail" aria-hidden="true">
        <div class="survey-rail-fill" style={`width: ${(position / total) * 100}%`}></div>
      </div>

      <h2 id="survey-question" class="display survey-ask" tabIndex={-1}>
        <RichText text={question.ask} />
      </h2>

      {question.kind === 'select' ? <Options {...props} /> : <TextAnswer {...props} />}

      <ReadMore readMore={question.readMore} />

      <footer class="survey-actions">
        {canGoBack && (
          <button type="button" class="glass" onClick={props.onBack}>{SURVEY.back}</button>
        )}
        <button type="button" class="glass prominent large" onClick={props.onNext}>
          {isLast ? SURVEY.finish : SURVEY.next}
        </button>
      </footer>
    </section>
  );
}

function Options({ question, value, onAnswer }: Props) {
  return (
    <div class="survey-options" role="radiogroup" aria-labelledby="survey-question">
      {(question.options ?? []).map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          class={`survey-option${value === option.value ? ' is-picked' : ''}`}
          onClick={() => onAnswer(option.value)}
        >
          <span class="survey-option-label">
            <RichText text={option.label} />
            {option.recommended && <span class="chip">Recommended</span>}
          </span>
          <span class="muted survey-option-example"><RichText text={option.example} /></span>
        </button>
      ))}
    </div>
  );
}

function TextAnswer({ question, value, onAnswer, onNext }: Props) {
  const examples = INPUT_EXAMPLES[question.configKey];
  return (
    <div class="survey-text">
      <input
        class="survey-input mono"
        type="text"
        value={typeof value === 'string' ? value : ''}
        placeholder={question.placeholder}
        aria-labelledby="survey-question"
        aria-describedby={examples ? 'survey-examples' : undefined}
        onInput={(event) => onAnswer(event.currentTarget.value)}
        onKeyDown={(event) => event.key === 'Enter' && onNext()}
      />
      {examples && (
        <p id="survey-examples" class="faint survey-examples">({examples})</p>
      )}
    </div>
  );
}
