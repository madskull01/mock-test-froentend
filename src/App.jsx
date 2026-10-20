import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Command,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { LandingPage } from "./components/landing/LandingPage";
import { PricingPlans, HistoryView } from "./components/account/AccountViews";
import { SidebarLink, DashboardHero, TestCatalog, DashboardFooter } from "./components/dashboard/DashboardViews";
import { TestRunner, ResultView, AnswerReview } from "./components/tests/TestViews";
import { RegisterModal, LoginPage } from "./components/auth/AuthViews";
import { ThemeToggle } from "./components/shared/ThemeToggle";

import AdminWorkspace from "./AdminWorkspace";
import { apiRequest } from "./api";

const USER_STORAGE_KEY = "formative.user";
const THEME_STORAGE_KEY = "formative.theme";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Razorpay Checkout could not be loaded."));
    document.body.appendChild(script);
  });
}

function App() {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [testSubjects, setTestSubjects] = useState({});
  const [history, setHistory] = useState([]);
  const [activePaymentPackage, setActivePaymentPackage] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [catalogMeta, setCatalogMeta] = useState({
    number: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [user, setUser] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
      if (storedUser?.token) return storedUser;
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState("overview");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogSize, setCatalogSize] = useState(10);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(null);
  const [testSession, setTestSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [answerReview, setAnswerReview] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startingTestId, setStartingTestId] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Keep the selected theme for this session when storage is unavailable.
    }
  }, [theme]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(catalogPage),
        size: String(catalogSize),
        duration: durationFilter,
        sortBy: "createdAt",
        direction: "desc",
      });
      if (search.trim()) params.set("search", search.trim());
      if (subjectFilter !== "all") params.set("subjectId", subjectFilter);
      if (sectionFilter !== "all") params.set("sectionId", sectionFilter);
      if (difficultyFilter !== "all")
        params.set("difficulty", difficultyFilter);
      const [catalog, allSubjects, activeSections] = await Promise.all([
        apiRequest(`/api/mock-tests/catalog?${params.toString()}`),
        apiRequest("/api/subjects"),
        apiRequest("/api/sections/active"),
      ]);
      const activeTests = catalog.content ?? [];
      const attachedQuestions = await Promise.all(
        activeTests.map((test) =>
          apiRequest(`/api/mock-tests/${test.id}/questions`).catch(() => []),
        ),
      );
      const subjectMap = Object.fromEntries(
        activeTests.map((test, index) => [
          test.id,
          [
            ...new Set(
              attachedQuestions[index]
                .map((item) => item.subjectId)
                .filter(Boolean),
            ),
          ],
        ]),
      );
      setTests(activeTests);
      setCatalogMeta({
        number: catalog.number ?? catalogPage,
        size: catalog.size ?? catalogSize,
        totalPages: catalog.totalPages ?? 0,
        totalElements: catalog.totalElements ?? 0,
      });
      setSubjects(allSubjects.filter((subject) => subject.active));
      setSections(activeSections);
      setTestSubjects(subjectMap);
      setError("");
      if (user?.id && user.role !== "ADMIN") {
        const attemptHistory = await apiRequest("/api/attempts/history");
        setHistory(attemptHistory);
      } else {
        setHistory([]);
      }
    } catch (requestError) {
      setError(
        requestError.message || "Could not connect to the mock test API.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    user,
    catalogPage,
    catalogSize,
    search,
    subjectFilter,
    sectionFilter,
    durationFilter,
    difficultyFilter,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(loadData, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setHistory([]);
      setPage("login");
      setError("Your session expired. Please sign in again.");
    };
    window.addEventListener("formative:auth-expired", handleAuthExpired);
    return () =>
      window.removeEventListener("formative:auth-expired", handleAuthExpired);
  }, []);

  const submitAttempt = useCallback(async () => {
    if (!attempt || !user?.id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const finalResult = await apiRequest(
        `/api/attempts/${attempt.attemptId}/submit`,
        { method: "POST" },
      );
      setResult(finalResult);
      setHistory((current) => [
        {
          attemptId: finalResult.attemptId,
          testId: finalResult.testId,
          testTitle: finalResult.testTitle,
          score: finalResult.score,
          totalMarks: finalResult.totalMarks,
          percentage: finalResult.percentage,
          status: "COMPLETED",
          startedAt: finalResult.startedAt,
          submittedAt: finalResult.submittedAt,
        },
        ...current.filter(
          (item) => item.attemptId !== finalResult.attemptId,
        ),
      ]);
      setAttempt(null);
      setTestSession(null);
      setPage("result");
    } catch (requestError) {
      setError(requestError.message || "Your test could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, user, isSubmitting]);

  useEffect(() => {
    if (!attempt || page !== "attempt") return undefined;
    if (secondsLeft <= 0) {
      const submitTimer = window.setTimeout(submitAttempt, 0);
      return () => window.clearTimeout(submitTimer);
    }
    const timer = window.setTimeout(
      () => setSecondsLeft((current) => current - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [attempt, page, secondsLeft, submitAttempt]);

  async function registerProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    try {
      const registered = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: "STUDENT",
        }),
      });
      const loginResponse = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const savedUser = {
        id: loginResponse.userId ?? registered.id,
        name: loginResponse.name ?? registered.name,
        email: loginResponse.email ?? registered.email,
        role: loginResponse.role ?? registered.role,
        token: loginResponse.token,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(savedUser));
      setUser(savedUser);
      setIsRegisterOpen(false);
      navigate("overview");
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not create your profile.");
    }
  }

  async function login(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoggingIn(true);
    setError("");
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const signedInUser = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        token: response.token,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(signedInUser));
      setUser(signedInUser);
      navigate("overview");
    } catch (requestError) {
      setError(
        requestError.message ||
          "We couldn't sign you in. Check your details and try again.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  const loginWithGoogle = useCallback(async (credential) => {
    setIsLoggingIn(true);
    setError("");
    try {
      const response = await apiRequest("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });
      const signedInUser = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        token: response.token,
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(signedInUser));
      setUser(signedInUser);
      setIsRegisterOpen(false);
      setPage("overview");
    } catch (requestError) {
      setError(requestError.message || "Google sign-in failed.");
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  async function startTest(test) {
    if (!user?.id) {
      setIsRegisterOpen(true);
      return;
    }
    setStartingTestId(test.id);
    setError("");
    try {
      const nextAttempt = await apiRequest(`/api/attempts/start/${test.id}`, {
        method: "POST",
      });
      const session = await apiRequest(
        `/api/attempts/${nextAttempt.attemptId}/test`,
      );
      const savedAnswers = await apiRequest(
        `/api/attempts/${nextAttempt.attemptId}/answers`,
      ).catch(() => []);
      setAttempt(nextAttempt);
      setTestSession(session);
      setAnswers(
        Object.fromEntries(
          savedAnswers.map((answer) => [
            answer.questionId,
            answer.selectedOptionId,
          ]),
        ),
      );
      setQuestionIndex(0);
      setSecondsLeft(
        (nextAttempt.durationMinutes ?? session.durationMinutes ?? 0) * 60,
      );
      setPage("attempt");
    } catch (requestError) {
      setError(requestError.message || "Could not start this test.");
    } finally {
      setStartingTestId(null);
    }
  }

  async function buyPackage(packageId) {
    if (!user?.id || user.role !== "STUDENT") {
      setIsRegisterOpen(true);
      return;
    }
    setActivePaymentPackage(packageId);
    setPaymentNotice(null);
    setError("");
    try {
      const order = await apiRequest("/api/payments/orders", {
        method: "POST",
        body: JSON.stringify({ packageId }),
      });
      await loadRazorpayCheckout();
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "cdacmocktest",
        description: order.packageName,
        order_id: order.orderId,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#17221f" },
        modal: {
          ondismiss: () => {
            setPaymentNotice({
              type: "pending",
              message:
                "Checkout closed. No section access was granted; completed payments are confirmed by the server.",
            });
          },
        },
        handler: async (response) => {
          try {
            const verification = await apiRequest("/api/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            if (verification.status === "PAID") {
              setPaymentNotice({
                type: "success",
                message: `${order.packageName} purchased successfully. Your section access is ready.`,
              });
              await loadData();
            } else {
              setPaymentNotice({
                type: "pending",
                message:
                  "Payment verification is pending capture. Access will be granted after confirmation.",
              });
            }
          } catch (verificationError) {
            setPaymentNotice({
              type: "error",
              message:
                verificationError.message ||
                "Payment could not be verified. Your access has not been changed.",
            });
          }
        },
      });
      checkout.on("payment.failed", (response) => {
        setPaymentNotice({
          type: "error",
          message:
            response.error?.description ||
            "Payment failed. You can try again when ready.",
        });
      });
      checkout.open();
    } catch (paymentError) {
      setPaymentNotice({
        type: "error",
        message: paymentError.message || "Could not start secure checkout.",
      });
    } finally {
      setActivePaymentPackage("");
    }
  }

  async function selectOption(question, option) {
    if (!attempt || !user?.id) return;
    setAnswers((current) => ({ ...current, [question.id]: option.id }));
    try {
      await apiRequest(`/api/attempts/${attempt.attemptId}/answers`, {
        method: "POST",
        body: JSON.stringify({
          questionId: question.id,
          optionId: option.id,
        }),
      });
    } catch (requestError) {
      setError(requestError.message || "Your answer could not be saved.");
    }
  }

  async function openAnswerReview() {
    if (!result?.attemptId) return;
    setReviewLoading(true);
    setError("");
    try {
      const review = await apiRequest(
        `/api/attempts/${result.attemptId}/review`,
      );
      setAnswerReview(review);
      setQuestionIndex(0);
      setPage("review");
    } catch (requestError) {
      setError(requestError.message || "Could not load answer review.");
    } finally {
      setReviewLoading(false);
    }
  }

  function navigate(nextPage) {
    setPage(nextPage);
    setIsMobileNavOpen(false);
    setError("");
  }

  function signOut() {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setHistory([]);
    navigate("overview");
  }

  const questions = testSession?.questions ?? [];
  const activeQuestion = questions[questionIndex];
  const completedCount = history.filter(
    (item) => item.status === "SUBMITTED",
  ).length;
  const averageScore = history.length
    ? Math.round(
        history.reduce((total, item) => total + (item.percentage ?? 0), 0) /
          history.length,
      )
    : 0;
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  if (page === "login" && !user) {
    return (
      <>
        <LoginPage
          onSubmit={login}
          onCreateProfile={() => {
            setError("");
            setIsRegisterOpen(true);
          }}
          error={error}
          onDismissError={() => setError("")}
          isSubmitting={isLoggingIn}
          googleClientId={GOOGLE_CLIENT_ID}
          onGoogleLogin={loginWithGoogle}
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        />
        {isRegisterOpen && (
          <RegisterModal
            onClose={() => setIsRegisterOpen(false)}
            onSubmit={registerProfile}
            error={error}
            onDismissError={() => setError("")}
            googleClientId={GOOGLE_CLIENT_ID}
            onGoogleLogin={loginWithGoogle}
            isSubmitting={isLoggingIn}
          />
        )}
      </>
    );
  }

  if (!user && page === "overview") {
    return (
      <>
        <LandingPage
          tests={tests}
          subjects={subjects}
          sections={sections}
          testSubjects={testSubjects}
          testCount={catalogMeta.totalElements}
          isLoading={isLoading}
          error={error}
          onDismissError={() => setError("")}
          onExplore={() => navigate("tests")}
          onExploreSubject={(subjectId) => {
            setSubjectFilter(String(subjectId));
            setSectionFilter("all");
            setCatalogPage(0);
            navigate("tests");
          }}
          onStartTest={startTest}
          onBuyPackage={buyPackage}
          paymentNotice={paymentNotice}
          activePaymentPackage={activePaymentPackage}
          onLogin={() => navigate("login")}
          onRegister={() => setIsRegisterOpen(true)}
          theme={theme}
          onToggleTheme={() =>
            setTheme((current) => (current === "dark" ? "light" : "dark"))
          }
        />
        {isRegisterOpen && (
          <RegisterModal
            onClose={() => setIsRegisterOpen(false)}
            onSubmit={registerProfile}
            error={error}
            onDismissError={() => setError("")}
            googleClientId={GOOGLE_CLIENT_ID}
            onGoogleLogin={loginWithGoogle}
            isSubmitting={isLoggingIn}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#17221f]">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-[#17221f] px-5 py-6 text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <a
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              navigate("overview");
            }}
            className="mb-11 flex items-center gap-3 px-2 text-white no-underline"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d8f270] text-[#17221f]">
              <Command size={20} strokeWidth={2.5} />
            </span>
            <span className="font-display text-[20px] font-extrabold">
              cdacmocktest
            </span>
          </a>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.7px] text-white/35">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Main navigation">
            <SidebarLink
              icon={LayoutDashboard}
              label="Overview"
              active={page === "overview"}
              onClick={() => navigate("overview")}
            />
            <SidebarLink
              icon={BookOpen}
              label="Practice tests"
              active={page === "tests"}
              onClick={() => navigate("tests")}
            />
            {user?.role === "STUDENT" && (
              <SidebarLink
                icon={CreditCard}
                label="Plans & pricing"
                active={page === "pricing"}
                onClick={() => navigate("pricing")}
              />
            )}
            <SidebarLink
              icon={Target}
              label="My results"
              active={page === "history"}
              onClick={() => navigate("history")}
            />
            {user?.role === "ADMIN" && (
              <SidebarLink
                icon={ShieldCheck}
                label="Admin workspace"
                active={page === "admin"}
                onClick={() => navigate("admin")}
              />
            )}
          </nav>
          <div className="mt-auto">
            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8166]/15 text-[#ff9d85]">
                <Sparkles size={16} />
              </div>
              <p className="font-display text-[14px] font-bold text-white">
                A little, often.
              </p>
              <p className="mt-1 text-[12px] leading-5 text-white/50">
                Short practice sessions add up to real progress.
              </p>
              <button
                onClick={() => navigate("tests")}
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#d8f270]"
              >
                Find a test <ArrowRight size={13} />
              </button>
            </div>
            <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#b5d9ce] text-[13px] font-bold text-[#17352d]">
                {user?.name?.slice(0, 1).toUpperCase() ?? (
                  <GraduationCap size={17} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold">
                  {user?.name ?? "Your profile"}
                </p>
                <p className="truncate text-[11px] text-white/40">
                  {user?.role === "ADMIN"
                    ? "Administrator"
                    : (user?.email ?? "Student workspace")}
                </p>
              </div>
              {user && (
                <button
                  onClick={signOut}
                  aria-label="Sign out"
                  title="Sign out"
                  className="rounded-md p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={15} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {isMobileNavOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close navigation"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-[#e6eae4] px-5 sm:px-8 xl:px-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-[#e0e5dd] text-[#43514b] lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={19} />
              </button>
              <span className="hidden text-[12px] font-semibold text-[#929a94] sm:inline">
                {today}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[#c2c9c2] sm:inline-block" />
              <span className="text-[12px] font-semibold text-[#63716a]">
                {page === "attempt"
                  ? "Test in progress"
                  : page === "history"
                    ? "Your results"
                    : page === "review"
                      ? "Answer review"
                    : page === "tests"
                      ? "Test library"
                      : page === "pricing"
                        ? "Plans & pricing"
                      : page === "admin"
                        ? "Admin workspace"
                        : "Your learning space"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                className="relative grid h-9 w-9 place-items-center rounded-full text-[#6d7972] hover:bg-[#e9ede7]"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-[8px] top-[7px] h-1.5 w-1.5 rounded-full bg-[#ff8166] ring-2 ring-[#f5f7f3]" />
              </button>
              <ThemeToggle
                theme={theme}
                onToggle={() =>
                  setTheme((current) =>
                    current === "dark" ? "light" : "dark",
                  )
                }
              />
              {!user && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("login")}
                    className="text-[12px] font-bold text-[#53645a] hover:text-[#17221f]"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="rounded-full bg-[#17221f] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#293a33]"
                  >
                    Create profile
                  </button>
                </div>
              )}
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-7 sm:px-8 xl:px-12">
            {error && (
              <div
                className="mb-5 flex items-start gap-3 rounded-xl border border-[#f1c4b8] bg-[#fff3ee] px-4 py-3 text-[12px] text-[#994a36]"
                role="alert"
              >
                <span className="flex-1">{error}</span>
                <button
                  onClick={() => setError("")}
                  aria-label="Dismiss message"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {page === "pricing" && user?.role === "STUDENT" ? (
              <PricingPlans
                onBuyPackage={buyPackage}
                paymentNotice={paymentNotice}
                activePaymentPackage={activePaymentPackage}
              />
            ) : page === "admin" && user?.role === "ADMIN" ? (
              <AdminWorkspace onCatalogChanged={loadData} />
            ) : page === "attempt" && testSession ? (
              <TestRunner
                attempt={attempt}
                session={testSession}
                questions={questions}
                activeQuestion={activeQuestion}
                questionIndex={questionIndex}
                answers={answers}
                secondsLeft={secondsLeft}
                isSubmitting={isSubmitting}
                onNavigate={setQuestionIndex}
                onSelect={selectOption}
                onSubmit={submitAttempt}
              />
            ) : page === "result" && result ? (
              <ResultView
                result={result}
                onReturn={() => navigate("overview")}
                onExplore={() => navigate("tests")}
                onReview={openAnswerReview}
                reviewLoading={reviewLoading}
              />
            ) : page === "review" ? (
              <AnswerReview
                questions={answerReview}
                onReturn={() => navigate("result")}
              />
            ) : page === "history" ? (
              <HistoryView
                history={history}
                hasUser={Boolean(user)}
                onRegister={() => setIsRegisterOpen(true)}
              />
            ) : (
              <>
                {page === "overview" && (
                  <DashboardHero
                    user={user}
                    testCount={tests.length}
                    onBrowse={() => navigate("tests")}
                  />
                )}
                <section className={page === "overview" ? "mt-10" : ""}>
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.8px] text-[#98a19a]">
                        {page === "overview"
                          ? "Pick up where you are"
                          : "Find your next challenge"}
                      </p>
                      <h2 className="font-display text-[23px] font-extrabold tracking-[-0.8px] text-[#1a2822]">
                        {page === "overview"
                          ? "Ready when you are"
                          : "Practice library"}
                      </h2>
                    </div>
                    {page === "overview" && (
                      <button
                        onClick={() => navigate("tests")}
                        className="hidden items-center gap-1.5 text-[12px] font-bold text-[#53645a] sm:inline-flex"
                      >
                        View all tests <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                  <TestCatalog
                    tests={page === "overview" ? tests.slice(0, 3) : tests}
                    subjects={subjects}
                    sections={sections}
                    testSubjects={testSubjects}
                    catalogMeta={catalogMeta}
                    catalogPage={catalogPage}
                    catalogSize={catalogSize}
                    isLoading={isLoading}
                    search={search}
                    onSearch={(value) => {
                      setSearch(value);
                      setCatalogPage(0);
                    }}
                    subjectFilter={subjectFilter}
                    onSubjectFilter={(value) => {
                      setSubjectFilter(value);
                      setSectionFilter("all");
                      setCatalogPage(0);
                    }}
                    sectionFilter={sectionFilter}
                    onSectionFilter={(value) => {
                      setSectionFilter(value);
                      setSubjectFilter("all");
                      setCatalogPage(0);
                    }}
                    durationFilter={durationFilter}
                    onDurationFilter={(value) => {
                      setDurationFilter(value);
                      setCatalogPage(0);
                    }}
                    difficultyFilter={difficultyFilter}
                    onDifficultyFilter={(value) => {
                      setDifficultyFilter(value);
                      setCatalogPage(0);
                    }}
                    onPageChange={setCatalogPage}
                    onPageSizeChange={(value) => {
                      setCatalogSize(value);
                      setCatalogPage(0);
                    }}
                    onStart={startTest}
                    startingTestId={startingTestId}
                    onRetry={() => {
                      setIsLoading(true);
                      loadData();
                    }}
                    hasError={Boolean(error)}
                  />
                </section>
                {page === "overview" && (
                  <DashboardFooter
                    history={history}
                    user={user}
                    averageScore={averageScore}
                    completedCount={completedCount}
                    onViewHistory={() => navigate("history")}
                    onRegister={() => setIsRegisterOpen(true)}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSubmit={registerProfile}
          error={error}
          onDismissError={() => setError("")}
          googleClientId={GOOGLE_CLIENT_ID}
          onGoogleLogin={loginWithGoogle}
          isSubmitting={isLoggingIn}
        />
      )}
    </div>
  );
}

export default App;
