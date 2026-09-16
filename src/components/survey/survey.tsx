/** @jsxImportSource preact */
import { useEffect, useState } from 'preact/hooks';
import {
  askedQuestions,
  catalog,
  defaultAnswer,
  matchesWhen,
  type Answers,
} from '@/src/lib/catalog';
import { toProfile } from '@/src/lib/profile';
import { storeProfile } from '@/src/lib/profile-client';
import { SURVEY } from '@/src/lib/setup-copy';
import { QuestionCard } from '@/src/components/survey/question-card';
import { Result } from '@/src/components/survey/result';
import '@/src/components/survey/survey.css';

/**
 * The site's one island (D5: Preact, `client:load`, at `/setup`) and its one piece of state.
 *
 * The survey and its result live on the same page on purpose. An island loses its state across
 * a `ClientRouter` navigation unless it is `transition:persist` (I4), so D4 avoids the problem
 * rather than working around it: nothing here navigates, and thirty answers are never at the
 * mercy of a page swap. If this ever spans two pages, D4 needs a supersession.
 */
type Stage = 'asking' | 'saving' | 'saved' | 'failed';

export function Survey() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [index, setIndex] = useState(0);
  const [trail, setTrail] = useState<number[]>([]);
  const [moved, setMoved] = useState(false);
  const [id, setId] = useState('');
  const [stage, setStage] = useState<Stage>('asking');

  const question = catalog.questions[index];

  /**
   * `?p=<id>` is read *after* hydration, never during the first render.
   *
   * `client:load` server-renders this island into the static page too, and the server has no
   * URL to read — so seeding the stage from the query string made the first client render
   * disagree with the HTML it was hydrating. Preact patches rather than replaces on a
   * mismatch, and the result's three rungs came out nested inside the question card's wrapper,
   * keeping its classes (seen 2026-09-16 on a reload of `/setup/?p=<id>`). One render behind is
   * invisible; a mismatched tree is not.
   */
  useEffect(() => {
    const restored = restoredId();
    if (restored === '') return;
    setId(restored);
    setStage('saved');
  }, []);

  // Only after the visitor has moved: focusing on first paint would yank the page down past
  // the heading and lede before they have read either.
  useEffect(() => {
    if (moved) document.querySelector<HTMLElement>('#survey-question')?.focus();
  }, [index, moved]);

  async function save() {
    setStage('saving');
    try {
      const saved = await storeProfile(toProfile(answers));
      // The id goes into the URL so a refresh, a bookmark or a reopened tab still lands on the
      // three rungs. Only the id: everything the result page shows is derived from it, so there
      // is nothing to re-fetch and no second way for this page to fail.
      window.history.replaceState(null, '', `?p=${saved}`);
      setId(saved);
      setStage('saved');
    } catch {
      setStage('failed');
    }
  }

  function answer(value: string) {
    setAnswers({ ...answers, [question.configKey]: value });
  }

  function next() {
    if (isLastAskable(index, answers)) return void save();
    setTrail([...trail, index]);
    setIndex(firstAskable(index + 1, answers));
    setMoved(true);
  }

  function back() {
    setIndex(trail[trail.length - 1] ?? index);
    setTrail(trail.slice(0, -1));
    setMoved(true);
  }

  if (stage === 'saving') return <Pending />;
  if (stage === 'failed') return <Failed onRetry={save} />;
  if (stage === 'saved') return <Result id={id} origin={window.location.origin} />;

  return (
    <QuestionCard
      question={question}
      value={answers[question.configKey] ?? ''}
      position={trail.length + 1}
      total={askedQuestions(answers).length}
      canGoBack={trail.length > 0}
      isLast={isLastAskable(index, answers)}
      onAnswer={answer}
      onBack={back}
      onNext={next}
    />
  );
}

/**
 * Every question starts on the answer the wizard would offer, so a visitor who agrees with the
 * recommendations can hold `Next` and end up with the profile `setup --yes` produces.
 */
function initialAnswers(): Answers {
  return Object.fromEntries(catalog.questions.map((q) => [q.configKey, defaultAnswer(q)]));
}

/**
 * The next question whose condition holds. This walks the catalog rather than a pre-filtered
 * list because the filter moves under it: answering `mode: team` adds `tracker` three questions
 * later, and answering it again as `solo` takes it away.
 */
function firstAskable(from: number, answers: Answers): number {
  const questions = catalog.questions;
  for (let at = from; at < questions.length; at += 1) {
    if (matchesWhen(questions[at].when, answers)) return at;
  }
  return questions.length;
}

function isLastAskable(index: number, answers: Answers): boolean {
  return firstAskable(index + 1, answers) >= catalog.questions.length;
}

/** `?p=<id>` on arrival means this tab already finished; show the rungs, not question one. */
function restoredId(): string {
  return new URLSearchParams(window.location.search).get('p') ?? '';
}

function Pending() {
  return (
    <section class="card survey-card survey-state">
      <p class="lede">{SURVEY.saving}</p>
    </section>
  );
}

function Failed({ onRetry }: { onRetry: () => void }) {
  return (
    <section class="card survey-card survey-state" role="alert">
      <h2 class="display">{SURVEY.errorHeading}</h2>
      <p class="muted">{SURVEY.errorBody}</p>
      <button type="button" class="glass prominent large" onClick={onRetry}>{SURVEY.retry}</button>
    </section>
  );
}
