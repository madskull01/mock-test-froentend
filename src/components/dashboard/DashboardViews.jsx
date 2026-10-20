import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  FileCheck2,
  Filter,
  LoaderCircle,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { formatDate, groupSubjectsBySection } from "../../utils/viewHelpers";

export function SidebarLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition ${active ? "bg-[#d8f270] text-[#17221f]" : "text-white/60 hover:bg-white/[0.07] hover:text-white"}`}
    >
      <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />
      <span>{label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#17221f]" />
      )}
    </button>
  );
}

export function DashboardHero({ user, testCount, onBrowse }) {
  return (
    <section className="hero-enter grid overflow-hidden rounded-[20px] bg-[#d8f270] lg:min-h-[262px] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative z-10 flex flex-col items-start justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#65752f]/15 bg-white/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[1.4px] text-[#526226]">
          <Sparkles size={13} /> Your study space
        </div>
        <h1 className="max-w-[550px] font-display text-[34px] font-extrabold leading-[1.08] tracking-[-1.6px] text-[#18231c] sm:text-[42px]">
          {user
            ? `Good to have you back, ${user.name.split(" ")[0]}.`
            : "Make room for your next breakthrough."}
        </h1>
        <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-[#35452b]">
          A focused practice today is a more confident you on test day.
        </p>
        <button
          onClick={onBrowse}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#17221f] px-5 py-3 text-[12px] font-bold text-white hover:bg-[#304238]"
        >
          Explore mock tests <ArrowRight size={15} />
        </button>
        <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-[#42552d]">
          <span className="flex -space-x-1.5">
            <span className="h-5 w-5 rounded-full border-2 border-[#d8f270] bg-[#fc8166]" />
            <span className="h-5 w-5 rounded-full border-2 border-[#d8f270] bg-[#698f82]" />
            <span className="h-5 w-5 rounded-full border-2 border-[#d8f270] bg-[#e0ad68]" />
          </span>
          <span>{testCount} active tests ready to explore</span>
        </div>
      </div>
      <div className="relative hidden min-h-[260px] overflow-hidden lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85"
          alt="Notebook and pen ready for a study session"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#d8f270] via-[#d8f270]/30 to-transparent" />
        <div className="absolute bottom-7 right-8 flex items-center gap-3 rounded-xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#17221f] text-[#d8f270]">
            <FileCheck2 size={18} />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase text-[#8a948d]">
              Small steps
            </span>
            <span className="mt-0.5 block text-[13px] font-bold">
              Big confidence
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

export function TestCatalog({
  tests,
  subjects,
  sections,
  testSubjects,
  isLoading,
  search,
  onSearch,
  catalogMeta,
  catalogPage,
  catalogSize,
  subjectFilter,
  onSubjectFilter,
  sectionFilter,
  onSectionFilter,
  durationFilter,
  onDurationFilter,
  difficultyFilter,
  onDifficultyFilter,
  onPageChange,
  onPageSizeChange,
  onStart,
  startingTestId,
  onRetry,
  hasError,
}) {
  const subjectGroups = groupSubjectsBySection(subjects, sections);

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative max-w-[360px] flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba49d]"
          />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search tests"
            aria-label="Search tests"
            className="h-10 w-full rounded-lg border border-[#e2e7e0] bg-white pl-10 pr-4 text-[12px] outline-none placeholder:text-[#a4aca6] focus:border-[#80964c]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8b958e]">
            <Filter size={13} />
            <span className="sr-only">Filters</span>
          </span>
          <select
            value={sectionFilter}
            onChange={(event) => onSectionFilter(event.target.value)}
            aria-label="Filter by section"
            className="h-9 max-w-[170px] rounded-full border border-[#e1e6df] bg-white px-3 text-[10px] font-bold text-[#69766f]"
          >
            <option value="all">All sections</option>
            {subjectGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            value={subjectFilter}
            onChange={(event) => onSubjectFilter(event.target.value)}
            aria-label="Filter by subject"
            className="h-9 max-w-[190px] rounded-full border border-[#e1e6df] bg-white px-3 text-[10px] font-bold text-[#69766f]"
          >
            <option value="all">All subjects</option>
            {subjectGroups.map((group) => (
              <optgroup key={group.id} label={group.name}>
                {group.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            value={difficultyFilter}
            onChange={(event) => onDifficultyFilter(event.target.value)}
            aria-label="Filter by difficulty"
            className="h-9 rounded-full border border-[#e1e6df] bg-white px-3 text-[10px] font-bold text-[#69766f]"
          >
            <option value="all">All difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          {[
            ["all", "All tests"],
            ["quick", "Quick practice"],
            ["full", "Full length"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => onDurationFilter(value)}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] font-bold ${durationFilter === value ? "bg-[#17221f] text-white" : "border border-[#e1e6df] bg-white text-[#69766f]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <div className="grid min-h-[180px] place-items-center rounded-xl border border-[#e6eae4] bg-white">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#728077]">
            <LoaderCircle size={18} className="animate-spin" /> Loading your
            test library
          </div>
        </div>
      ) : tests.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test, index) => (
            <TestCard
              key={test.id}
              test={test}
              index={index}
              subjects={(testSubjects[test.id] ?? [])
                .map(
                  (id) => subjects.find((subject) => subject.id === id)?.name,
                )
                .filter(Boolean)}
              onStart={onStart}
              isStarting={startingTestId === test.id}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#d9e0d8] bg-white px-5 py-12 text-center">
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-[#eff3eb] text-[#75877b]">
            <BookOpen size={19} />
          </div>
          <p className="font-display text-[15px] font-extrabold text-[#24312a]">
            {hasError
              ? "Your test library is taking a break"
              : search
                ? "No tests match that search"
                : subjectFilter !== "all"
                  ? "No tests in this subject yet"
                  : "No active tests just yet"}
          </p>
          <p className="mx-auto mt-1.5 max-w-[390px] text-[12px] leading-5 text-[#849088]">
            {hasError
              ? "Check that the Spring API is running, then try again."
              : "Choose another subject or check back after a new test is published."}
          </p>
          {hasError && (
            <button
              onClick={onRetry}
              className="mt-4 rounded-full bg-[#17221f] px-4 py-2 text-[11px] font-bold text-white"
            >
              Try again
            </button>
          )}
          {!isLoading && catalogMeta.totalElements > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6eae4] bg-white px-4 py-3">
              <p className="text-[11px] text-[#758078]" aria-live="polite">
                Page {catalogMeta.number + 1} of {Math.max(catalogMeta.totalPages, 1)}
                <span className="mx-1.5 text-[#c2c9c2]">·</span>
                {catalogMeta.totalElements} tests
              </p>
              <div className="flex items-center gap-2">
                <label className="sr-only" htmlFor="catalog-page-size">
                  Tests per page
                </label>
                <select
                  id="catalog-page-size"
                  value={catalogSize}
                  onChange={(event) => onPageSizeChange(Number(event.target.value))}
                  className="h-9 rounded-full border border-[#e1e6df] bg-white px-3 text-[10px] font-bold text-[#69766f]"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size} per page
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onPageChange(catalogPage - 1)}
                  disabled={catalogPage === 0 || isLoading}
                  className="rounded-full border border-[#e1e6df] px-3.5 py-2 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <span className="text-[10px] font-bold text-[#53645a]">
                  {catalogPage + 1}
                </span>
                <button
                  onClick={() => onPageChange(catalogPage + 1)}
                  disabled={catalogPage + 1 >= catalogMeta.totalPages || isLoading}
                  className="rounded-full border border-[#e1e6df] px-3.5 py-2 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export function TestCard({ test, index, subjects, onStart, isStarting }) {
  const themes = [
    { icon: "bg-[#e8f1df] text-[#607d4d]", tag: "bg-[#d8e8cd] text-[#49673a]" },
    { icon: "bg-[#fce8df] text-[#b76b52]", tag: "bg-[#f7d9cc] text-[#99563f]" },
    { icon: "bg-[#e4edf0] text-[#567988]", tag: "bg-[#d5e5e9] text-[#466a77]" },
  ];
  const theme = themes[index % themes.length];
  return (
    <article className="group relative flex min-h-[210px] flex-col rounded-xl border border-[#e6eae4] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cad3c8] hover:shadow-lg">
      <button
        type="button"
        onClick={() => onStart(test)}
        disabled={isStarting}
        aria-label={`Start ${test.title}`}
        className="absolute inset-0 z-0 cursor-pointer rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80964c] disabled:cursor-wait"
      />
      <div className="pointer-events-none relative z-10 flex min-h-[168px] flex-1 flex-col">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${theme.icon}`}
        >
          <BookOpen size={18} />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[1px] ${theme.tag}`}
        >
          {test.durationMinutes <= 30 ? "Quick set" : "Mock exam"}
        </span>
      </div>
      <h3 className="mt-4 font-display text-[16px] font-extrabold leading-5 text-[#202d26]">
        {test.title}
      </h3>
      {subjects.length > 0 && (
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.8px] text-[#799064]">
          {subjects.join(" · ")}
        </p>
      )}
      <p className="mt-1.5 line-clamp-2 min-h-[36px] text-[11px] leading-[18px] text-[#89938c]">
        {test.description ||
          "A focused set to help you build confidence and keep your preparation moving."}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-[#edf0eb] pt-4">
        <div className="flex items-center gap-3 text-[10px] font-semibold text-[#758078]">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={13} />
            {test.durationMinutes}m
          </span>
          <span className="inline-flex items-center gap-1">
            <FileCheck2 size={13} />
            {test.questionCount ?? "—"} Qs
          </span>
          <span>{test.totalMarks ?? "—"} pts</span>
        </div>
        <button
          onClick={() => onStart(test)}
          disabled={isStarting}
          aria-label={`Start ${test.title}`}
          className="pointer-events-auto relative z-20 grid h-8 w-8 place-items-center rounded-full bg-[#17221f] text-white disabled:opacity-60"
        >
          {isStarting ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : (
            <ArrowUpRight size={15} />
          )}
        </button>
      </div>
      </div>
    </article>
  );
}

export function DashboardFooter({
  history,
  user,
  averageScore,
  completedCount,
  onViewHistory,
  onRegister,
}) {
  return (
    <section className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-xl border border-[#e6eae4] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#98a19a]">
              Your momentum
            </p>
            <h2 className="mt-1 font-display text-[17px] font-extrabold">
              Progress, at a glance
            </h2>
          </div>
          {user && (
            <button
              onClick={onViewHistory}
              className="text-[11px] font-bold text-[#617168]"
            >
              See results <ArrowRight size={13} />
            </button>
          )}
        </div>
        {user ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Metric
              label="Tests completed"
              value={completedCount}
              note="Keep showing up"
            />
            <Metric
              label="Average score"
              value={`${averageScore}%`}
              note={
                history.length ? "Across attempts" : "Your first one is waiting"
              }
            />
            <Metric
              label="Recent activity"
              value={
                history.length
                  ? formatDate(history[0].submittedAt ?? history[0].startedAt)
                  : "—"
              }
              note="Last test session"
              extraClass="hidden sm:block"
            />
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-start gap-3 rounded-lg bg-[#f4f7f1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[410px] text-[12px] leading-5 text-[#69766e]">
              Create a student profile to save your attempts and see your scores
              here.
            </p>
            <button
              onClick={onRegister}
              className="rounded-full border border-[#c8d2c2] bg-white px-4 py-2 text-[11px] font-bold text-[#34463a]"
            >
              Set up profile
            </button>
          </div>
        )}
      </div>
      <div className="rounded-xl bg-[#e6edf1] p-5 sm:p-6">
        <div className="mb-4 grid h-9 w-9 place-items-center rounded-lg bg-white/80 text-[#527283]">
          <Target size={17} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#6f8894]">
          Your next step
        </p>
        <h3 className="mt-1 max-w-[250px] font-display text-[18px] font-extrabold text-[#253941]">
          Build a routine that works for you.
        </h3>
        <p className="mt-3 text-[11px] leading-5 text-[#6e828b]">
          Choose a test, take it at your pace, and learn from every attempt.
        </p>
      </div>
    </section>
  );
}

export function Metric({ label, value, note, extraClass = "" }) {
  return (
    <div className={`rounded-lg bg-[#f6f8f4] px-4 py-3 ${extraClass}`}>
      <p className="text-[10px] font-semibold text-[#879189]">{label}</p>
      <p className="mt-1 font-display text-[22px] font-extrabold text-[#25332a]">
        {value}
      </p>
      <p className="mt-0.5 text-[9px] text-[#a1aaa2]">{note}</p>
    </div>
  );
}
