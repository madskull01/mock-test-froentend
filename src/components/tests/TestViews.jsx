import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
} from "lucide-react";
import { formatTime } from "../../utils/viewHelpers";
import { resolveApiUrl } from "../../api";

export function TestRunner({
  attempt,
  session,
  questions,
  activeQuestion,
  questionIndex,
  answers,
  secondsLeft,
  isSubmitting,
  onNavigate,
  onSelect,
  onSubmit,
}) {
  const [confirm, setConfirm] = useState(false);
  const answered = Object.keys(answers).length;
  if (!activeQuestion)
    return (
      <div className="grid min-h-[420px] place-items-center text-center">
        <div>
          <p className="font-display text-xl font-extrabold">
            This test has no questions yet.
          </p>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="mt-5 rounded-full bg-[#17221f] px-5 py-3 text-[12px] font-bold text-white"
          >
            Submit attempt
          </button>
        </div>
      </div>
    );
  return (
    <section className="mx-auto max-w-[1080px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#8b968e]">
            Question {questionIndex + 1} of {questions.length}
          </p>
          <h1 className="font-display text-[25px] font-extrabold">
            {session.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e3e9e1] bg-white px-4 py-2.5">
          <Clock3 size={16} />
          <span className="font-display text-[18px] font-extrabold tabular-nums">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>
      <div className="mb-5 h-1.5 rounded-full bg-[#e5eae2]">
        <div
          className="h-full rounded-full bg-[#8eaa59]"
          style={{
            width: `${((questionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_230px]">
        <article className="rounded-xl border border-[#e5eae3] bg-white p-5 sm:p-8">
          <div className="mb-5 flex justify-between text-[10px] font-semibold text-[#87938b]">
            <span>Question {String(questionIndex + 1).padStart(2, "0")}</span>
            <span>{activeQuestion.marks} marks</span>
          </div>
          <h2 className="whitespace-pre-wrap font-display text-[19px] font-bold leading-[1.55] text-[#25332b]">
            {activeQuestion.questionText}
          </h2>
          {activeQuestion.imageUrl && (
            <img
              src={resolveApiUrl(activeQuestion.imageUrl)}
              alt="Question illustration"
              className="mt-5 max-h-[420px] max-w-full rounded-lg border border-[#e8ece6] object-contain"
            />
          )}
          <div className="mt-7 space-y-2.5">
            {(activeQuestion.options ?? []).map((option, index) => {
              const selected = answers[activeQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onSelect(activeQuestion, option)}
                  className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left ${selected ? "border-[#8ca75a] bg-[#f3f8e9]" : "border-[#e8ece6] hover:border-[#c5d1bf]"}`}
                >
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${selected ? "border-[#6e8c45] bg-[#6e8c45] text-white" : "border-[#d9e0d7] text-[#7f8c82]"}`}
                  >
                    {selected ? (
                      <Check size={13} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="pt-0.5 text-[12px] leading-5 text-[#69776e]">
                    {option.optionText}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex justify-between border-t border-[#edf0eb] pt-5">
            <button
              disabled={!questionIndex}
              onClick={() => onNavigate(questionIndex - 1)}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-bold disabled:opacity-40"
            >
              <ArrowLeft size={14} /> Previous
            </button>
            {questionIndex < questions.length - 1 ? (
              <button
                onClick={() => onNavigate(questionIndex + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-5 py-2.5 text-[11px] font-bold text-white"
              >
                Next question <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setConfirm(true)}
                className="rounded-full bg-[#17221f] px-5 py-2.5 text-[11px] font-bold text-white"
              >
                Submit test
              </button>
            )}
          </div>
        </article>
        <aside className="h-fit rounded-xl border border-[#e5eae3] bg-white p-5">
          <h3 className="font-display text-[13px] font-extrabold">
            Question map
          </h3>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => onNavigate(index)}
                aria-label={`Go to question ${index + 1}`}
                className={`aspect-square rounded-md text-[10px] font-bold ${index === questionIndex ? "bg-[#17221f] text-white" : answers[question.id] ? "bg-[#dceacb] text-[#47643e]" : "bg-[#f0f3ef] text-[#839087]"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <p className="mt-5 border-t pt-4 text-[10px] text-[#89958c]">
            {answered} answered ·{" "}
            {attempt.durationMinutes ?? session.durationMinutes} minutes
          </p>
          <button
            onClick={() => setConfirm(true)}
            className="mt-3 w-full rounded-lg border py-2 text-[10px] font-bold"
          >
            Finish test
          </button>
        </aside>
      </div>
      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17221f]/45 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-[390px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 className="font-display text-[19px] font-extrabold">
              Finish this attempt?
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-[#7b8880]">
              You have answered {answered} of {questions.length} questions.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirm(false)}
                className="rounded-full border px-4 py-2.5 text-[11px] font-bold"
              >
                Keep going
              </button>
              <button
                onClick={() => {
                  setConfirm(false);
                  onSubmit();
                }}
                disabled={isSubmitting}
                className="rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-bold text-white"
              >
                {isSubmitting ? "Submitting…" : "Submit test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function ResultView({ result, onReturn, onExplore, onReview, reviewLoading }) {
  return (
    <section className="mx-auto max-w-[800px] pt-5">
      <div className="overflow-hidden rounded-2xl border border-[#e5eae3] bg-white">
        <div className="bg-[#17221f] px-6 py-9 text-white sm:px-10">
          <span
            className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase ${result.passed ? "bg-[#d8f270] text-[#35452b]" : "bg-[#ff8b70]/20 text-[#ffab98]"}`}
          >
            {result.passed ? "Passing score" : "Attempt complete"}
          </span>
          <p className="mt-4 text-[11px] text-white/50">{result.testTitle}</p>
          <h1 className="mt-1 font-display text-[34px] font-extrabold">
            {result.percentage != null
              ? `${Math.round(result.percentage)}%`
              : "Well done"}
          </h1>
          <p className="text-[13px] text-white/60">
            You scored {result.score} out of {result.totalMarks} marks.
          </p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-[#edf0eb] sm:grid-cols-4">
          {[
            ["Correct", result.correctAnswers ?? 0],
            ["Incorrect", result.incorrectAnswers ?? 0],
            ["Unanswered", result.unanswered ?? 0],
            ["Total questions", result.totalQuestions ?? 0],
            ["Score", `${result.score ?? 0}/${result.totalMarks ?? 0}`],
            ["Attempted", result.attemptedQuestions ?? 0],
            ["Time taken", formatTime(result.timeTakenSeconds ?? 0)],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-5 text-center">
              <p className="font-display text-[21px] font-extrabold">{value}</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[1px] text-[#95a097]">
                {label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-3 border-t border-[#edf0eb] px-6 py-5">
          <button
            onClick={onReturn}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-bold"
          >
            <ArrowLeft size={14} /> Overview
          </button>
          <button
            onClick={onReview}
            disabled={reviewLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[#dbe2d8] px-4 py-2.5 text-[11px] font-bold disabled:opacity-60"
          >
            {reviewLoading ? "Loading review…" : "Review answers"}
          </button>
          <button
            onClick={onExplore}
            className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-5 py-2.5 text-[11px] font-bold text-white"
          >
            Try another test <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function AnswerReview({ questions, onReturn }) {
  const [filter, setFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const filteredQuestions = questions.filter((question) => {
    if (filter === "correct") return question.correct;
    if (filter === "incorrect") return question.answered && !question.correct;
    if (filter === "unanswered") return !question.answered;
    return true;
  });
  const activeQuestion = filteredQuestions[activeIndex];

  if (!questions.length) {
    return (
      <section className="mx-auto max-w-[800px] rounded-2xl border border-[#e5eae3] bg-white p-8 text-center">
        <h1 className="font-display text-xl font-extrabold">No review available</h1>
        <button onClick={onReturn} className="mt-4 text-sm font-bold underline">
          Return to your result
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[960px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#98a19a]">
            Learn from every answer
          </p>
          <h1 className="mt-1 font-display text-[25px] font-extrabold">
            Answer review
          </h1>
        </div>
        <button
          onClick={onReturn}
          className="rounded-full border border-[#dbe2d8] bg-white px-4 py-2.5 text-[11px] font-bold"
        >
          Back to result
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2" aria-label="Filter reviewed questions">
        {[
          ["all", `All (${questions.length})`],
          ["correct", `Correct (${questions.filter((q) => q.correct).length})`],
          [
            "incorrect",
            `Incorrect (${questions.filter((q) => q.answered && !q.correct).length})`,
          ],
          ["unanswered", `Unattempted (${questions.filter((q) => !q.answered).length})`],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              setFilter(value);
              setActiveIndex(0);
            }}
            className={`rounded-full px-4 py-2 text-[11px] font-bold ${filter === value ? "bg-[#17221f] text-white" : "border border-[#e1e6df] bg-white text-[#69766f]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {activeQuestion && (
        <article className="rounded-2xl border border-[#e5eae3] bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#879189]">
              Question {activeQuestion.questionNumber} of {questions.length}
            </p>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${!activeQuestion.answered ? "bg-[#edf0eb] text-[#68766e]" : activeQuestion.correct ? "bg-[#e5f2d8] text-[#426c35]" : "bg-[#fff0eb] text-[#a6533e]"}`}
            >
              {!activeQuestion.answered
                ? "Unattempted"
                : activeQuestion.correct
                  ? "Correct"
                  : "Incorrect"}
            </span>
          </div>
          <h2 className="mt-4 text-[16px] font-bold leading-7 text-[#24312a]">
            {activeQuestion.questionText}
          </h2>
          {activeQuestion.imageUrl && (
            <img
              src={resolveApiUrl(activeQuestion.imageUrl)}
              alt="Question illustration"
              className="mt-4 max-h-[420px] max-w-full rounded-lg border border-[#e8ece6] object-contain"
            />
          )}
          <div className="mt-5 space-y-2">
            {activeQuestion.options.map((option, index) => (
              <div
                key={option.optionId}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-[13px] ${option.correct ? "border-[#a8c58e] bg-[#f1f7e9] text-[#3f6334]" : option.selected ? "border-[#e7b2a3] bg-[#fff4f0] text-[#8c4939]" : "border-[#e8ece6] text-[#67736b]"}`}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[10px] font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option.optionText}</span>
                <span className="text-[10px] font-bold">
                  {option.correct
                    ? "Correct answer"
                    : option.selected
                      ? "Your answer"
                      : ""}
                </span>
              </div>
            ))}
          </div>
          {activeQuestion.explanation && (
            <div className="mt-5 rounded-xl bg-[#f4f7f1] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#68766e]">
                Explanation
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-[#45544a]">
                {activeQuestion.explanation}
              </p>
            </div>
          )}
          <p className="mt-4 text-[11px] font-semibold text-[#758078]">
            Marks awarded: {activeQuestion.marksAwarded ?? 0}
            {activeQuestion.marksDeducted > 0
              ? ` · Negative marks: ${activeQuestion.marksDeducted}`
              : ""}
          </p>
          <div className="mt-6 flex justify-between border-t border-[#edf0eb] pt-4">
            <button
              onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
              disabled={activeIndex === 0}
              className="rounded-full border px-4 py-2 text-[11px] font-bold disabled:opacity-45"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setActiveIndex((index) =>
                  Math.min(filteredQuestions.length - 1, index + 1),
                )
              }
              disabled={activeIndex + 1 >= filteredQuestions.length}
              className="rounded-full bg-[#17221f] px-4 py-2 text-[11px] font-bold text-white disabled:opacity-45"
            >
              Next
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
