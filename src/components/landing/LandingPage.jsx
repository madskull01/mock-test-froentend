import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  FileCheck2,
  GraduationCap,
  Menu,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { groupSubjectsBySection } from "../../utils/viewHelpers";
import { PricingPlans } from "../account/AccountViews";
import { ThemeToggle } from "../shared/ThemeToggle";

const syllabusSections = [
  {
    label: "Section A",
    title: "Fundamentals",
    subjects: [
      {
        name: "English",
        topics: [
          "Synonyms & Antonyms",
          "Reading Comprehension",
          "Sentence Completion",
          "Articles & Prepositions",
          "Spotting Errors",
          "Idioms & Phrases",
          "Active & Passive Voice",
          "Sentence Arrangement",
        ],
      },
      {
        name: "Quantitative Aptitude",
        topics: [
          "Number System",
          "Percentage",
          "Profit & Loss",
          "Ratio & Proportion",
          "Time & Work",
          "Time & Distance",
          "Simple & Compound Interest",
          "Averages",
          "Algebra",
          "Geometry",
        ],
      },
      {
        name: "Reasoning",
        topics: [
          "Analogy",
          "Blood Relations",
          "Direction Sense",
          "Coding-Decoding",
          "Series (Number & Letter)",
          "Sitting Arrangement",
          "Data Sufficiency",
        ],
      },
      {
        name: "Computer Fundamentals & Concepts of Programming",
        topics: [
          "Basic Computer Concepts",
          "Software & Hardware",
          "Number Systems",
          "Networking Basics",
          "Computer Security",
        ],
      },
    ],
  },
  {
    label: "Section B",
    title: "Programming & Systems",
    subjects: [
      {
        name: "C Programming",
        topics: [
          "C Basics & Syntax",
          "Operators & Expressions",
          "Control Flow",
          "Functions",
          "Pointers",
          "Arrays & Strings",
          "Structures & Unions",
          "File Handling",
          "Memory Management",
          "Preprocessor Directives",
        ],
      },
      {
        name: "Data Structures",
        topics: [
          "Arrays",
          "Linked Lists",
          "Stacks",
          "Queues",
          "Trees (Binary, BST, AVL)",
          "Graphs (BFS, DFS)",
          "Hashing",
          "Sorting Algorithms",
        ],
      },
      {
        name: "Object-Oriented Programming (C++)",
        topics: [
          "Classes & Objects",
          "Inheritance",
          "Polymorphism",
          "Encapsulation & Abstraction",
          "Templates & STL",
        ],
      },
      {
        name: "Operating Systems & Networking",
        topics: [
          "OS Concepts",
          "Process Management",
          "Memory Management",
          "Networking (OSI, TCP/IP)",
          "File Systems",
        ],
      },
      {
        name: "Big Data",
        topics: [
          "Big Data Fundamentals (5 V's)",
          "Hadoop Ecosystem",
          "MapReduce",
          "NoSQL Databases",
        ],
      },
      {
        name: "Artificial Intelligence",
        topics: [
          "AI Fundamentals",
          "Machine Learning Basics",
          "Neural Networks",
          "Natural Language Processing",
        ],
      },
    ],
  },
  {
    label: "Section C",
    title: "Computer Architecture & Hardware",
    subjects: [
      {
        name: "Computer Architecture",
        topics: [
          "CPU Architecture",
          "Memory Hierarchy",
          "I/O Systems",
          "Addressing Modes",
        ],
      },
      {
        name: "Digital Electronics",
        topics: [
          "Boolean Algebra",
          "Logic Gates",
          "Combinational Circuits",
          "Sequential Circuits",
          "Number Representation",
        ],
      },
      {
        name: "Microprocessors",
        topics: ["8085 & 8086 Architecture", "Assembly Programming", "Interrupts"],
      },
    ],
  },
];

export function LandingPage({
  tests,
  subjects,
  sections,
  testSubjects,
  testCount,
  isLoading,
  error,
  onDismissError,
  onExplore,
  onExploreSubject,
  onStartTest,
  onBuyPackage,
  paymentNotice,
  activePaymentPackage,
  onLogin,
  onRegister,
  theme,
  onToggleTheme,
}) {
  const [openFaq, setOpenFaq] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const featuredTests = tests.slice(0, 3);
  const subjectGroups = groupSubjectsBySection(subjects, sections);
  const faqs = [
    {
      question: "What is the CDAC C-CAT mock test platform?",
      answer:
        "It is an online practice platform for candidates preparing for the CDAC C-CAT. Browse the currently available free CDAC mock test in the practice library, create a student profile, and review your saved results. Paid section packages are also available.",
    },
    {
      question: "What are Sections A, B, and C in CDAC C-CAT preparation?",
      answer:
        "Section A covers general aptitude and fundamentals. Section B covers computer science and programming and is relevant to many Category II and III programs. Section C covers hardware and electronics and is relevant to some Category III programs. Check the current official CDAC admission information for the requirements of your chosen program.",
    },
    {
      question: "What subjects can I practice for the CDAC C-CAT?",
      answer:
        "Subjects are organized into the sections configured in the live practice library. They may include aptitude, computer science, programming, hardware, or electronics; availability depends on what is currently published.",
    },
    {
      question: "Are free CDAC mock tests available?",
      answer:
        "Yes. At least one full CDAC mock test is available to take for free. Create a student account or sign in to start a free CDAC mock test. Additional section packages may require payment; check the pricing section for current details.",
    },
    {
      question: "How do I take a CDAC mock test?",
      answer:
        "Choose a free CDAC mock test or another available practice test from the library and create an account or sign in to begin. Your attempt and result are saved to your account.",
    },
    {
      question: "Are these official CDAC exam papers?",
      answer:
        "No. This is an independent practice platform, not an official CDAC website. Use current official CDAC admission notices to confirm the latest exam pattern and program requirements.",
    },
    {
      question: "Can I review my score after submitting a test?",
      answer:
        "Completed tests include a result summary. Answer review is available after submission when enabled for that test.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8f4] text-[#17221f]">
      <header className="sticky top-0 z-30 border-b border-[#e8ece5] bg-[#f7f8f4]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a
            href="#home"
            aria-label="CDAC Mock Test home"
            className="flex items-center gap-2.5 no-underline"
          >
            <img className="h-10 w-10 rounded-xl" src="/favicon.svg" alt="" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[18px] font-extrabold tracking-[-0.6px]">
                CDAC
              </span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[1.5px] text-[#718a42]">
                Mock Test
              </span>
            </span>
          </a>
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Main navigation"
          >
            <a className="landing-nav-link" href="#home">Home</a>
            <a className="landing-nav-link" href="#practice">Tests</a>
            <a className="landing-nav-link" href="#exam-sections">Exam sections</a>
            <a className="landing-nav-link" href="#syllabus">Syllabus</a>
            <a className="landing-nav-link" href="#subjects">Subjects</a>
            <a className="landing-nav-link" href="#pricing">Pricing</a>
            <a className="landing-nav-link" href="#free-demo">Free demo</a>
            <a className="landing-nav-link" href="#how-it-works">How it works</a>
            <a className="landing-nav-link" href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#dfe5dc] text-[#43514b] md:hidden"
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="landing-mobile-navigation"
            >
              {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <button
              onClick={onLogin}
              className="hidden rounded-full px-3 py-2 text-[12px] font-bold text-[#53645a] hover:text-[#17221f] sm:inline-flex"
            >
              Log in
            </button>
            <button
              onClick={onRegister}
              className="rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-[#304238] sm:px-5 sm:text-[12px]"
            >
              Create account
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <nav
            id="landing-mobile-navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-1 border-t border-[#e8ece5] px-5 py-3 md:hidden"
            aria-label="Mobile navigation"
          >
            {[
              ["Home", "#home"],
              ["Tests", "#practice"],
              ["Exam sections", "#exam-sections"],
              ["Syllabus", "#syllabus"],
              ["Subjects", "#subjects"],
              ["Pricing", "#pricing"],
              ["Free demo", "#free-demo"],
              ["How it works", "#how-it-works"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                className="landing-nav-link rounded-lg px-2 py-2.5"
                href={href}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main>
        {error && (
          <div
            className="mx-auto mt-4 flex max-w-[1180px] items-start gap-3 rounded-xl border border-[#f1c4b8] bg-[#fff3ee] px-4 py-3 text-[12px] text-[#994a36]"
            role="alert"
          >
            <span className="flex-1">{error}</span>
            <button onClick={onDismissError} aria-label="Dismiss message">
              <X size={16} />
            </button>
          </div>
        )}
        <section id="home" className="relative mx-auto max-w-[1240px] px-5 pb-14 pt-10 sm:px-8 sm:pt-16 lg:pb-20 lg:pt-20">
          <div className="pointer-events-none absolute -right-28 top-12 h-[430px] w-[430px] rounded-full bg-[#e8efd8] blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="hero-enter">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe7d7] bg-white/80 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[1.35px] text-[#61764a] shadow-sm">
                <Sparkles size={13} />
                CDAC C-CAT practice
              </div>
              <h1 className="mt-6 max-w-[640px] font-display text-[42px] font-extrabold leading-[1.08] tracking-[-2.6px] text-[#17221f] sm:text-[58px] lg:text-[68px]">
                Prepare for CDAC C-CAT with a free mock test and{" "}
                <span className="relative whitespace-nowrap text-[#718a42]">
                  focused practice.
                </span>
              </h1>
              <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-[#69766e] sm:text-[16px]">
                Practice general aptitude, computer science and programming,
                and hardware and electronics. Start the free CDAC mock test,
                track your results, and decide what to study next.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-6 py-3.5 text-[12px] font-bold text-white shadow-lg shadow-[#17221f]/10 transition hover:-translate-y-0.5 hover:bg-[#304238]"
                >
                  Explore practice tests <ArrowRight size={15} />
                </button>
                <button
                  onClick={onRegister}
                  className="rounded-full border border-[#d8dfd5] bg-white px-6 py-3.5 text-[12px] font-bold text-[#314138] transition hover:border-[#aebba7] hover:bg-[#fbfcf9]"
                >
                  Start your journey
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[#7b887f]">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#718a42]" /> Progress saved
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#718a42]" /> Results you can learn from
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -left-3 top-12 hidden h-20 w-20 rounded-[26px] border border-white/80 bg-[#d8f270] shadow-lg shadow-[#17221f]/5 sm:block" />
              <div className="absolute -right-3 bottom-12 hidden h-16 w-16 rounded-full bg-[#f4c6b2] sm:block" />
              <div className="relative rounded-[28px] border border-white bg-white p-3 shadow-[0_30px_90px_-45px_rgba(23,34,31,0.35)] sm:p-4">
                <div className="overflow-hidden rounded-[20px] bg-[#17221f] p-5 text-white sm:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[1.8px] text-white/45">
                        Your next practice
                      </p>
                      <p className="mt-1 font-display text-[17px] font-extrabold">
                        Small steps. Strong progress.
                      </p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d8f270] text-[#17221f]">
                      <Target size={19} />
                    </span>
                  </div>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-[#d8f270]/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1px] text-[#d8f270]">
                        Practice library
                      </span>
                      <span className="text-[10px] font-semibold text-white/45">
                        Live catalogue
                      </span>
                    </div>
                    {isLoading ? (
                      <div className="mt-5 space-y-3" aria-label="Loading tests">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
                        <div className="mt-5 h-10 animate-pulse rounded-xl bg-white/10" />
                      </div>
                    ) : featuredTests.length ? (
                      <>
                        <h2 className="mt-4 font-display text-[21px] font-extrabold leading-tight sm:text-[25px]">
                          {featuredTests[0].title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/55">
                          {featuredTests[0].description ||
                            "A focused practice session, ready when you are."}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold text-white/65">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={13} /> {featuredTests[0].durationMinutes} min
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <FileCheck2 size={13} /> {featuredTests[0].questionCount ?? "—"} questions
                          </span>
                        </div>
                        <button
                          onClick={() => onStartTest(featuredTests[0])}
                          className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#d8f270] px-4 py-3 text-[11px] font-extrabold text-[#17221f] transition hover:bg-[#e4fa8c]"
                        >
                          Start this test <ArrowUpRight size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="py-8 text-center">
                        <BookOpen size={23} className="mx-auto text-white/40" />
                        <p className="mt-3 text-[12px] font-bold">Your practice library is getting ready</p>
                        <p className="mt-1 text-[10px] text-white/50">
                          Published tests will show here.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.06] p-3.5">
                      <p className="text-[9px] font-semibold text-white/45">ACTIVE PRACTICE TESTS</p>
                      <p className="mt-1 font-display text-[22px] font-extrabold text-[#d8f270]">
                        {isLoading ? "…" : testCount}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.06] p-3.5">
                      <p className="text-[9px] font-semibold text-white/45">SUBJECTS TO EXPLORE</p>
                      <p className="mt-1 font-display text-[22px] font-extrabold text-[#d8f270]">
                        {isLoading ? "…" : subjects.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-[#e9ede5] bg-white px-4 py-3 shadow-xl shadow-[#17221f]/[0.06] sm:left-[-20px]">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eff4e8] text-[#61764a]">
                  <GraduationCap size={18} />
                </span>
                <span>
                  <span className="block text-[10px] font-extrabold text-[#26332b]">
                    Your own learning space
                  </span>
                  <span className="mt-0.5 block text-[9px] text-[#89948c]">
                    Practice at your pace
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8ece5] bg-white">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-5 px-5 py-7 sm:px-8 md:grid-cols-4 md:gap-0">
            {[
              [isLoading ? "…" : String(testCount), "active practice tests"],
              [isLoading ? "…" : String(subjects.length), "active subjects"],
              ["Anytime", "practice at your pace"],
              ["Your account", "results saved securely"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-2 text-center ${index > 1 ? "md:border-l md:border-[#edf0eb]" : ""}`}
              >
                <p className="font-display text-[21px] font-extrabold tracking-[-0.7px] text-[#26352d] sm:text-[24px]">
                  {value}
                </p>
                <p className="mt-1 text-[10px] font-semibold text-[#89948c] sm:text-[11px]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="subjects" className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
                Explore by subject
              </p>
              <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]">
                Find your focus.
              </h2>
            </div>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#61764a] hover:text-[#26352d]"
            >
              Browse all tests <ArrowRight size={14} />
            </button>
          </div>
          {isLoading ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-[104px] animate-pulse rounded-2xl border border-[#e8ece5] bg-white"
                />
              ))}
            </div>
          ) : subjects.length ? (
            <div className="mt-7 space-y-8">
              {subjectGroups.map((group, groupIndex) => (
                <section
                  key={group.id}
                  aria-labelledby={`subject-group-${group.id}`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <h3
                      id={`subject-group-${group.id}`}
                      className="font-display text-[16px] font-extrabold"
                    >
                      {group.name}
                    </h3>
                    <span className="rounded-full bg-[#fee2e2] px-2.5 py-1 text-[10px] font-bold text-[#b91c1c]">
                      {group.subjects.length}{" "}
                      {group.subjects.length === 1 ? "subject" : "subjects"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.subjects.map((subject, subjectIndex) => (
                      <button
                        key={subject.id}
                        onClick={() => onExploreSubject(subject.id)}
                        className="group flex items-center gap-4 rounded-2xl border border-[#e7ebe4] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#cbd6c4] hover:shadow-lg hover:shadow-[#17221f]/[0.04]"
                      >
                        <span
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-[15px] ${["bg-[#edf3e5] text-[#718a42]", "bg-[#fbeee7] text-[#b76b52]", "bg-[#e8f0f2] text-[#567988]"][(groupIndex + subjectIndex) % 3]}`}
                        >
                          <BookOpen size={19} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[14px] font-extrabold text-[#26352d]">
                            {subject.name}
                          </span>
                          <span className="mt-1 block truncate text-[10px] text-[#89948c]">
                            {subject.description || "Explore focused practice"}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="text-[#a3ada4] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#61764a]"
                        />
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-[#d9e0d8] bg-white px-5 py-9 text-center text-[12px] text-[#849088]">
              Active subjects will appear here when they are published.
            </div>
          )}
        </section>

        <section
          id="exam-sections"
          className="border-y border-[#e8ece5] bg-white"
          aria-labelledby="exam-sections-heading"
        >
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
            <div className="max-w-[760px]">
              <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
                CDAC C-CAT preparation
              </p>
              <h2
                id="exam-sections-heading"
                className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]"
              >
                Prepare by CDAC C-CAT section
              </h2>
              <p className="mt-3 text-[13px] leading-6 text-[#7b887f]">
                Use section-wise practice to focus your preparation. Program
                eligibility and the current exam pattern can vary, so confirm
                the requirements in the latest official CDAC admission notice.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Section A",
                  title: "General Aptitude & Fundamentals",
                  description:
                    "Build a foundation in general aptitude and fundamentals. This section is common across candidate test papers.",
                },
                {
                  label: "Section B",
                  title: "Computer Science & Programming",
                  description:
                    "Practice computer science and programming topics for relevant Category II and Category III programs, such as Advanced Computing, Big Data, AI, and ITISS.",
                },
                {
                  label: "Section C",
                  title: "Hardware & Electronics",
                  description:
                    "Focus on hardware and electronics topics for relevant Category III programs, such as Embedded Systems Design and VLSI Design.",
                },
              ].map(({ label, title, description }) => (
                <article
                  key={label}
                  className="rounded-2xl border border-[#e7ebe4] bg-[#fbfcf9] p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#718a42]">
                    {label}
                  </p>
                  <h3 className="mt-3 font-display text-[16px] font-extrabold text-[#26352d]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-6 text-[#7b887f]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-5 text-[#89948c]">
              CDAC Mock Test is an independent practice platform and is not
              affiliated with or endorsed by CDAC.
            </p>
          </div>
        </section>

        <section
          id="syllabus"
          className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20"
          aria-labelledby="syllabus-heading"
        >
          <div className="max-w-[760px]">
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
              Test sections & syllabus
            </p>
            <h2
              id="syllabus-heading"
              className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]"
            >
              Explore the CCAT syllabus.
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-[#7b887f]">
              Review the topics covered across Sections A, B, and C, then choose
              the course category that matches your preparation.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {syllabusSections.map(({ label, title, subjects }) => (
              <section
                key={label}
                className="rounded-3xl border border-[#e7ebe4] bg-white p-5 sm:p-7"
                aria-labelledby={`syllabus-${label.replaceAll(" ", "-")}`}
              >
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#eff4e8] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[1px] text-[#61764a]">
                    {label}
                  </span>
                  <h3
                    id={`syllabus-${label.replaceAll(" ", "-")}`}
                    className="font-display text-[19px] font-extrabold text-[#26352d]"
                  >
                    {title}
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.map(({ name, topics }) => (
                    <article
                      key={name}
                      className="rounded-2xl border border-[#edf0eb] bg-[#fbfcf9] p-4"
                    >
                      <h4 className="text-[13px] font-extrabold leading-5 text-[#26352d]">
                        {name}
                      </h4>
                      <ul className="mt-3 space-y-2">
                        {topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex gap-2 text-[11px] leading-5 text-[#718078]"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#829b52]"
                            />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <section
              className="rounded-3xl bg-[#17221f] p-6 text-white sm:p-7"
              aria-labelledby="course-categories-heading"
            >
              <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#d8f270]">
                Course categories
              </p>
              <h3
                id="course-categories-heading"
                className="mt-2 font-display text-[20px] font-extrabold"
              >
                Choose your test combination
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  {
                    category: "Section A + B",
                    detail: "100 questions · 300 marks · 120 minutes",
                  },
                  {
                    category: "Section A + B + C",
                    detail: "150 questions · 450 marks · 180 minutes",
                  },
                ].map(({ category, detail }) => (
                  <div
                    key={category}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <h4 className="text-[12px] font-extrabold text-[#d8f270]">
                      {category}
                    </h4>
                    <p className="mt-2 text-[11px] leading-5 text-white/70">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="rounded-3xl border border-[#e7ebe4] bg-white p-6 sm:p-7"
              aria-labelledby="exam-notes-heading"
            >
              <p className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#82906f]">
                Important notes
              </p>
              <h3
                id="exam-notes-heading"
                className="mt-2 font-display text-[20px] font-extrabold text-[#26352d]"
              >
                Know the exam format
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {[
                  "The medium of the CCAT examination is English only.",
                  "Candidates appear for sections as per their selected course category.",
                  "Each section has objective-type questions with four options.",
                  "A wrong answer carries a -1 mark penalty.",
                  "There is no negative marking for unattempted questions.",
                  "Questions can be attempted in any order within a section.",
                ].map((note) => (
                  <li
                    key={note}
                    className="flex gap-2.5 text-[11px] leading-5 text-[#718078]"
                  >
                    <Check
                      size={14}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[#718a42]"
                    />
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <p className="mt-5 text-[10px] leading-5 text-[#89948c]">
            Exam pattern and syllabus details are provided for preparation.
            Please check the latest official CDAC admission information for
            updates and course-specific requirements.
          </p>
        </section>

        <section id="practice" className="bg-[#edf1e9]">
          <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
                  Ready when you are
                </p>
                <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]">
                  Practice with purpose.
                </h2>
              </div>
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#61764a] hover:text-[#26352d]"
              >
                See the full library <ArrowRight size={14} />
              </button>
            </div>
            {isLoading ? (
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-[220px] animate-pulse rounded-2xl bg-white"
                  />
                ))}
              </div>
            ) : featuredTests.length ? (
              <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredTests.map((test, index) => {
                  const testSubjectNames = (testSubjects[test.id] || [])
                    .map((id) => subjects.find((subject) => subject.id === id)?.name)
                    .filter(Boolean);
                  return (
                    <article
                      key={test.id}
                      className="relative flex min-h-[232px] flex-col rounded-2xl border border-[#e3e8df] bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#17221f]/[0.06]"
                    >
                      <button
                        type="button"
                        onClick={() => onStartTest(test)}
                        aria-label={`Start ${test.title}`}
                        className="absolute inset-0 z-0 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80964c]"
                      />
                      <div className="pointer-events-none relative z-10 flex min-h-[190px] flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eff4e8] text-[#718a42]">
                          {index === 1 ? <Target size={18} /> : <FileCheck2 size={18} />}
                        </span>
                        <span className="rounded-full bg-[#f1f4ef] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[1px] text-[#7a887e]">
                          {test.durationMinutes <= 30 ? "Quick practice" : "Mock test"}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-[16px] font-extrabold text-[#26352d]">
                        {test.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 min-h-[36px] text-[11px] leading-5 text-[#89948c]">
                        {test.description ||
                          "A focused practice set to help you prepare with confidence."}
                      </p>
                      {testSubjectNames.length > 0 && (
                        <p className="mt-2 truncate text-[9px] font-bold uppercase tracking-[0.8px] text-[#718a42]">
                          {testSubjectNames.join(" · ")}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between border-t border-[#edf0eb] pt-4">
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-[#758078]">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} /> {test.durationMinutes}m
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FileCheck2 size={13} /> {test.questionCount ?? "—"} Qs
                          </span>
                        </div>
                        <button
                          onClick={() => onStartTest(test)}
                          aria-label={`Start ${test.title}`}
                          className="pointer-events-auto relative z-20 inline-flex items-center gap-1.5 rounded-full bg-[#17221f] px-3.5 py-2 text-[10px] font-bold text-white transition hover:bg-[#304238]"
                        >
                          Start <ArrowRight size={13} />
                        </button>
                      </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-[#d9e0d8] bg-white px-5 py-10 text-center">
                <BookOpen size={22} className="mx-auto text-[#82906f]" />
                <p className="mt-3 font-display text-[14px] font-extrabold text-[#26352d]">
                  No active tests yet
                </p>
                <p className="mt-1 text-[11px] text-[#89948c]">
                  Check back when new practice tests are published.
                </p>
              </div>
            )}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-[620px] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
              A simple routine
            </p>
            <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]">
              Make practice count.
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-[#7b887f]">
              A few clear steps take you from choosing a test to understanding
              what to work on next.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Search,
                title: "Choose a practice test",
                description:
                  "Browse active mock tests and select a subject or challenge that fits your study session.",
              },
              {
                number: "02",
                icon: FileCheck2,
                title: "Focus on your attempt",
                description:
                  "Work through the questions at your own pace while your progress is saved to your account.",
              },
              {
                number: "03",
                icon: Target,
                title: "Learn from your result",
                description:
                  "Review your score and, when available, revisit answers and explanations to guide your next step.",
              },
            ].map(({ number, icon: Icon, title, description }) => (
              <article
                key={number}
                className="rounded-2xl border border-[#e7ebe4] bg-white p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#eff4e8] text-[#718a42]">
                    <Icon size={19} />
                  </span>
                  <span className="font-display text-[14px] font-extrabold text-[#b2bcb0]">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[15px] font-extrabold text-[#26352d]">
                  {title}
                </h3>
                <p className="mt-2 text-[11px] leading-5 text-[#89948c]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="free-demo" className="border-y border-[#e8ece5] bg-white">
          <div className="mx-auto grid max-w-[1240px] gap-7 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center lg:py-14">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
                Free CDAC mock test practice
              </p>
              <h2 className="mt-2 font-display text-[23px] font-extrabold tracking-[-0.7px] sm:text-[28px]">
                Start with a free CDAC mock test.
              </h2>
              <p className="mt-2 max-w-[680px] text-[12px] leading-6 text-[#7b887f]">
                {tests.length
                  ? "A free CDAC mock test is available in the practice library. Create a student account or sign in to begin. Additional section packages may be paid; see pricing for current details."
                  : "No CDAC mock tests are available right now. Check back later for free practice tests and other published tests."}
              </p>
            </div>
            <button
              onClick={onExplore}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17221f] px-5 py-3 text-[11px] font-bold text-white transition hover:bg-[#304238]"
            >
              {tests.length ? "Browse CDAC mock tests" : "View practice library"}
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        <section id="pricing" className="bg-[#f7f8f4]">
          <PricingPlans
            onBuyPackage={onBuyPackage}
            paymentNotice={paymentNotice}
            activePaymentPackage={activePaymentPackage}
          />
        </section>

        <section className="px-5 pb-16 sm:px-8 lg:pb-20">
          <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[26px] bg-[#17221f] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
            <div className="pointer-events-none absolute -right-12 -top-32 h-80 w-80 rounded-full border-[44px] border-white/[0.035]" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[1.7px] text-[#d8f270]">
                  Your next step starts here
                </p>
                <h2 className="mt-2 max-w-[550px] font-display text-[26px] font-extrabold tracking-[-0.8px] sm:text-[32px]">
                  Ready to see what you can do?
                </h2>
                <p className="mt-2 text-[12px] leading-5 text-white/55">
                  Find a test, create your account, and make your next practice session count.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 rounded-full bg-[#d8f270] px-5 py-3 text-[11px] font-extrabold text-[#17221f] hover:bg-[#e4fa8c]"
                >
                  Browse tests <ArrowRight size={14} />
                </button>
                <button
                  onClick={onRegister}
                  className="rounded-full border border-white/20 px-5 py-3 text-[11px] font-bold text-white hover:bg-white/10"
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="faq" className="border-t border-[#e8ece5] bg-white">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#82906f]">
              Good to know
            </p>
            <h2 className="mt-2 font-display text-[28px] font-extrabold tracking-[-1px] sm:text-[34px]">
              Questions, answered.
            </h2>
            <p className="mt-3 max-w-[360px] text-[12px] leading-6 text-[#7b887f]">
              Learn a little more about practicing with cdacmocktest.
            </p>
          </div>
          <div className="divide-y divide-[#edf0eb] border-y border-[#edf0eb]">
            {faqs.map((faq, index) => (
              <div key={faq.question}>
                <button
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[13px] font-bold text-[#26352d]">
                    {faq.question}
                  </span>
                  <span
                    className={`text-[19px] font-normal text-[#82906f] transition-transform ${openFaq === index ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {openFaq === index && (
                  <p className="max-w-[600px] pb-5 pr-8 text-[12px] leading-6 text-[#7b887f]">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#17221f] text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <a
            href="#home"
            aria-label="CDAC Mock Test home"
            className="flex items-center gap-2.5 text-white no-underline"
          >
            <img className="h-9 w-9 rounded-lg" src="/favicon.svg" alt="" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[16px] font-extrabold">
                CDAC
              </span>
              <span className="mt-1 text-[8px] font-bold uppercase tracking-[1.3px] text-white/60">
                Mock Test
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold text-white/55" aria-label="Footer navigation">
            <a className="transition hover:text-white" href="#practice">Tests</a>
            <a className="transition hover:text-white" href="#syllabus">Syllabus</a>
            <a className="transition hover:text-white" href="#subjects">Subjects</a>
            <a className="transition hover:text-white" href="#pricing">Pricing</a>
            <a className="transition hover:text-white" href="#free-demo">Free demo</a>
            <a className="transition hover:text-white" href="#how-it-works">How it works</a>
            <a className="transition hover:text-white" href="#faq">FAQ</a>
            <button className="transition hover:text-white" onClick={onLogin}>Log in</button>
          </nav>
          <p className="text-[10px] text-white/35">
            Practice with purpose. Grow with every attempt.
          </p>
        </div>
      </footer>
    </div>
  );
}
