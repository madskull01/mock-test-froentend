import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CircleHelp,
  FilePlus2,
  Layers3,
  LoaderCircle,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { apiRequest } from "./api";

const fieldClass =
  "h-10 w-full rounded-lg border border-[#e1e7df] bg-white px-3 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50";
const labelClass = "mb-1.5 block text-[10px] font-bold text-[#56645b]";

export default function AdminWorkspace({ onCatalogChanged }) {
  const [view, setView] = useState("subjects");
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadAdminData() {
    setLoading(true);
    setError("");
    try {
      const [sectionData, subjectData, testData] = await Promise.all([
        apiRequest("/api/sections"),
        apiRequest("/api/subjects"),
        apiRequest("/api/mock-tests"),
      ]);
      setSections(sectionData);
      setSubjects(subjectData);
      setTests(testData);
      setSelectedSubjectId(
        (current) => current || String(subjectData[0]?.id ?? ""),
      );
    } catch (requestError) {
      setError(requestError.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleTestFreeAccess(test) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const updatedTest = await apiRequest(`/api/mock-tests/${test.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: test.title,
          description: test.description,
          durationMinutes: test.durationMinutes,
          totalMarks: test.totalMarks,
          passingMarks: test.passingMarks,
          active: test.active,
          freeAccess: !test.freeAccess,
        }),
      });
      setTests((current) =>
        current.map((item) =>
          item.id === updatedTest.id ? updatedTest : item,
        ),
      );
      setNotice(
        updatedTest.freeAccess
          ? `“${updatedTest.title}” is now free for everyone.`
          : `“${updatedTest.title}” now requires section access.`,
      );
      await onCatalogChanged();
    } catch (requestError) {
      setError(requestError.message || "Could not update test access.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      apiRequest("/api/sections"),
      apiRequest("/api/subjects"),
      apiRequest("/api/mock-tests"),
    ])
      .then(([sectionData, subjectData, testData]) => {
        if (!isCurrent) return;
        setSections(sectionData);
        setSubjects(subjectData);
        setTests(testData);
        setSelectedSubjectId(
          (current) => current || String(subjectData[0]?.id ?? ""),
        );
      })
      .catch((requestError) => {
        if (isCurrent)
          setError(requestError.message || "Could not load admin data.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSubjectId) return;
    let isCurrent = true;
    apiRequest(`/api/questions/subject/${selectedSubjectId}`)
      .then((subjectQuestions) => {
        if (!isCurrent) return;
        setQuestions(subjectQuestions);
        setSelectedQuestionIds([]);
      })
      .catch((requestError) => {
        if (isCurrent)
          setError(requestError.message || "Could not load questions.");
      });
    return () => {
      isCurrent = false;
    };
  }, [selectedSubjectId]);

  useEffect(() => {
    if (view !== "users" || usersLoaded) return undefined;
    let isCurrent = true;
    Promise.all([
      apiRequest("/api/users"),
      apiRequest("/api/payments/admin/history"),
    ])
      .then(([userData, paymentData]) => {
        if (!isCurrent) return;
        setUsers(userData);
        setUserPayments(paymentData);
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(requestError.message || "Could not load user details.");
        }
      })
      .finally(() => {
        if (isCurrent) setUsersLoaded(true);
      });
    return () => {
      isCurrent = false;
    };
  }, [view, usersLoaded]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = userSearch.trim().toLowerCase();
    if (!normalizedSearch) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        String(user.id).includes(normalizedSearch),
    );
  }, [users, userSearch]);

  const selectedQuestions = useMemo(
    () =>
      questions.filter((question) => selectedQuestionIds.includes(question.id)),
    [questions, selectedQuestionIds],
  );
  const selectedMarks = selectedQuestions.reduce(
    (total, question) => total + (question.marks ?? 0),
    0,
  );

  async function handleCreateSection(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const section = await apiRequest("/api/sections", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("sectionName"),
          description: formData.get("sectionDescription"),
        }),
      });
      setSections((current) => [...current, section]);
      form.reset();
      setNotice(`${section.name} section created.`);
    } catch (requestError) {
      setError(requestError.message || "Could not create the section.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateSubject(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const sectionId = formData.get("sectionId");
      const subject = await apiRequest(`/api/sections/${sectionId}/subjects`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("subjectName"),
          description: formData.get("subjectDescription"),
        }),
      });
      setSubjects((current) => [...current, subject]);
      setSelectedSubjectId(String(subject.id));
      form.reset();
      setNotice(`${subject.name} is ready for questions.`);
      await onCatalogChanged();
    } catch (requestError) {
      setError(requestError.message || "Could not create the subject.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateQuestion(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const correctOption = Number(formData.get("correctOption"));
    const options = [1, 2, 3, 4].map((optionNumber) => ({
      optionText: formData.get(`option${optionNumber}`),
      correct: optionNumber === correctOption,
    }));
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const questionPayload = {
        questionText: formData.get("questionText"),
        explanation: formData.get("explanation"),
        marks: Number(formData.get("marks")),
        negativeMarks: Number(formData.get("negativeMarks")),
        difficulty: formData.get("difficulty"),
        options,
      };
      const image = formData.get("image");
      let question;
      if (image instanceof File && image.size > 0) {
        const multipartData = new FormData();
        multipartData.append(
          "question",
          new Blob([JSON.stringify(questionPayload)], {
            type: "application/json",
          }),
        );
        multipartData.append("image", image);
        question = await apiRequest(
          `/api/questions/subjects/${selectedSubjectId}`,
          { method: "POST", body: multipartData },
        );
      } else {
        question = await apiRequest(
        `/api/questions/subjects/${selectedSubjectId}`,
        {
          method: "POST",
          body: JSON.stringify(questionPayload),
        },
      );
      }
      setQuestions((current) => [...current, question]);
      form.reset();
      setNotice(
        image instanceof File && image.size > 0
          ? "Question and image added to the selected subject."
          : "Question added to the selected subject.",
      );
    } catch (requestError) {
      setError(requestError.message || "Could not create the question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateTest(event) {
    event.preventDefault();
    if (!selectedQuestions.length) {
      setError("Select at least one question for this test.");
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const test = await apiRequest("/api/mock-tests", {
        method: "POST",
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          durationMinutes: Number(formData.get("durationMinutes")),
          totalMarks: Number(formData.get("totalMarks")),
          passingMarks: Number(formData.get("passingMarks")),
          freeAccess: formData.get("freeAccess") === "on",
        }),
      });
      for (const [index, question] of selectedQuestions.entries()) {
        await apiRequest(`/api/mock-tests/${test.id}/questions`, {
          method: "POST",
          body: JSON.stringify({
            questionId: question.id,
            questionOrder: index + 1,
          }),
        });
      }
      setTests((current) => [test, ...current]);
      setSelectedQuestionIds([]);
      form.reset();
      setNotice(
        `“${test.title}” is published with ${selectedQuestions.length} questions.`,
      );
      await onCatalogChanged();
    } catch (requestError) {
      setError(
        requestError.message ||
          "The test could not be completed. Check its questions and try again.",
      );
      await loadAdminData();
    } finally {
      setSaving(false);
    }
  }

  function toggleQuestion(questionId) {
    setSelectedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  return (
    <section className="mx-auto max-w-[1120px] pt-2">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.7px] text-[#8d9a90]">
            <ShieldCheck size={13} /> Admin workspace
          </p>
          <h1 className="font-display text-[30px] font-extrabold tracking-[-1px] text-[#1d2a23]">
            Build the test library
          </h1>
          <p className="mt-2 max-w-[600px] text-[13px] leading-6 text-[#7c8980]">
            Organize subjects, write questions, and publish a ready-to-take mock
            test.
          </p>
        </div>
        <div className="flex flex-wrap rounded-full border border-[#e1e7df] bg-white p-1">
          <AdminTab
            active={view === "subjects"}
            onClick={() => setView("subjects")}
          >
            <Layers3 size={14} /> Subjects & questions
          </AdminTab>
          <AdminTab active={view === "tests"} onClick={() => setView("tests")}>
            <FilePlus2 size={14} /> Mock tests
          </AdminTab>
          <AdminTab active={view === "users"} onClick={() => setView("users")}>
            <Users size={14} /> Users
          </AdminTab>
        </div>
      </div>

      {error && (
        <Message tone="error" onDismiss={() => setError("")}>
          {error}
        </Message>
      )}
      {notice && (
        <Message tone="success" onDismiss={() => setNotice("")}>
          {notice}
        </Message>
      )}

      {loading ? (
        <div className="rounded-xl border border-[#e5eae3] bg-white px-5 py-12 text-center text-[12px] font-semibold text-[#7d8981]">
          Loading admin workspace…
        </div>
      ) : view === "users" ? (
        <UsersDirectory
          users={filteredUsers}
          allUsers={users}
          payments={userPayments}
          search={userSearch}
          onSearch={setUserSearch}
          isLoading={!usersLoaded}
        />
      ) : view === "subjects" ? (
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-5">
            <Panel
              icon={Plus}
              eyebrow="First, organize"
              title="Create a section"
              description="Sections group related subjects together."
            >
              <form onSubmit={handleCreateSection} className="space-y-3">
                <label className="block">
                  <span className={labelClass}>Section name</span>
                  <input
                    required
                    name="sectionName"
                    maxLength="100"
                    placeholder="e.g. Entrance preparation"
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Description</span>
                  <textarea
                    name="sectionDescription"
                    maxLength="500"
                    rows="2"
                    placeholder="A short note about this section"
                    className="w-full resize-y rounded-lg border border-[#e1e7df] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                  />
                </label>
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#304238] disabled:opacity-50"
                >
                  <Plus size={14} /> Add section
                </button>
              </form>
            </Panel>

            <Panel
              icon={BookOpen}
              eyebrow="Build your catalog"
              title="Add a subject"
              description="Every subject belongs to a section."
            >
              <form onSubmit={handleCreateSubject} className="space-y-3">
                <label className="block">
                  <span className={labelClass}>Section</span>
                  <select
                    required
                    name="sectionId"
                    defaultValue=""
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Select a section
                    </option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Subject name</span>
                  <input
                    required
                    name="subjectName"
                    maxLength="100"
                    placeholder="e.g. Applied Mathematics"
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Description</span>
                  <textarea
                    name="subjectDescription"
                    maxLength="500"
                    rows="2"
                    placeholder="What will students practice?"
                    className="w-full resize-y rounded-lg border border-[#e1e7df] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                  />
                </label>
                <button
                  disabled={saving || !sections.length}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#304238] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={14} /> Add subject
                </button>
                {!sections.length && (
                  <p className="text-[10px] text-[#9b7762]">
                    Create a section before adding a subject.
                  </p>
                )}
              </form>
            </Panel>
          </div>

          <Panel
            icon={FilePlus2}
            eyebrow="Question bank"
            title="Write a question"
            description="Questions are added to a subject and can be used in multiple mock tests."
          >
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <label className="block">
                <span className={labelClass}>Subject</span>
                <select
                  required
                  value={selectedSubjectId}
                  onChange={(event) => setSelectedSubjectId(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                      {subject.sectionName ? ` · ${subject.sectionName}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={labelClass}>Question</span>
                <textarea
                  required
                  name="questionText"
                  rows="3"
                  placeholder="Write the question prompt"
                  className="w-full resize-y rounded-lg border border-[#e1e7df] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                />
              </label>
              <label className="block">
                <span className={labelClass}>
                  Question image{" "}
                  <span className="font-medium text-[#9ba49d]">(optional)</span>
                </span>
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="block w-full rounded-lg border border-[#e1e7df] bg-white px-3 py-2 text-[11px] text-[#69776e] file:mr-3 file:rounded-md file:border-0 file:bg-[#eef3e8] file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:text-[#536c40]"
                />
                <span className="mt-1 block text-[9px] text-[#89958c]">
                  PNG, JPEG, or GIF · up to 5 MB
                </span>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((number) => (
                  <label key={number} className="block">
                    <span className={labelClass}>
                      Option {String.fromCharCode(64 + number)}
                    </span>
                    <input
                      required
                      name={`option${number}`}
                      placeholder={`Answer option ${number}`}
                      className={fieldClass}
                    />
                  </label>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className={labelClass}>Correct option</span>
                  <select
                    name="correctOption"
                    defaultValue="1"
                    className={fieldClass}
                  >
                    {[1, 2, 3, 4].map((number) => (
                      <option key={number} value={number}>
                        Option {String.fromCharCode(64 + number)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Difficulty</span>
                  <select
                    name="difficulty"
                    defaultValue="MEDIUM"
                    className={fieldClass}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className={labelClass}>Marks</span>
                    <input
                      required
                      name="marks"
                      type="number"
                      min="1"
                      defaultValue="1"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={labelClass}>Penalty</span>
                    <input
                      name="negativeMarks"
                      type="number"
                      min="0"
                      defaultValue="0"
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
              <label className="block">
                <span className={labelClass}>
                  Explanation{" "}
                  <span className="font-medium text-[#9ba49d]">(optional)</span>
                </span>
                <textarea
                  name="explanation"
                  rows="2"
                  placeholder="Explain why the answer is correct"
                  className="w-full resize-y rounded-lg border border-[#e1e7df] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                />
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] pt-4">
                <span className="text-[10px] text-[#8b968e]">
                  {questions.length} question{questions.length === 1 ? "" : "s"}{" "}
                  in this subject
                </span>
                <button
                  disabled={saving || !selectedSubjectId}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[#304238] disabled:opacity-50"
                >
                  <Plus size={14} /> Add question
                </button>
              </div>
            </form>
          </Panel>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <Panel
            icon={FilePlus2}
            eyebrow="Publish a practice set"
            title="Create a mock test"
            description="Choose a subject and select its questions. They will appear together in the student test library."
          >
            <form onSubmit={handleCreateTest} className="space-y-4">
              <label className="block">
                <span className={labelClass}>Test title</span>
                <input
                  required
                  name="title"
                  maxLength="200"
                  placeholder="e.g. Mathematics · Foundations"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Description</span>
                <textarea
                  name="description"
                  maxLength="1000"
                  rows="2"
                  placeholder="A brief description for students"
                  className="w-full resize-y rounded-lg border border-[#e1e7df] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#80964c] focus:ring-2 focus:ring-[#d8f270]/50"
                />
              </label>
              <label className="flex items-start gap-2.5 rounded-lg border border-[#e7ece5] bg-[#fafbf9] p-3">
                <input
                  name="freeAccess"
                  type="checkbox"
                  className="mt-0.5 accent-[#526c40]"
                />
                <span>
                  <span className="block text-[11px] font-bold text-[#3d4c42]">
                    Free for everyone
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-4 text-[#89958c]">
                    Students can start this test without purchasing section
                    access.
                  </span>
                </span>
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className={labelClass}>Duration (min)</span>
                  <input
                    required
                    name="durationMinutes"
                    type="number"
                    min="1"
                    defaultValue="30"
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Total marks</span>
                  <input
                    required
                    name="totalMarks"
                    type="number"
                    min="1"
                    defaultValue={selectedMarks || 1}
                    key={`${selectedSubjectId}-${selectedQuestionIds.join(",")}`}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Passing marks</span>
                  <input
                    required
                    name="passingMarks"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Subject</span>
                <select
                  required
                  value={selectedSubjectId}
                  onChange={(event) => setSelectedSubjectId(event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-lg border border-[#e7ece5]">
                <div className="flex items-center justify-between gap-3 border-b border-[#edf0eb] bg-[#fafbf9] px-4 py-3">
                  <span className="text-[10px] font-bold text-[#59685e]">
                    Choose questions
                  </span>
                  <span className="text-[9px] font-semibold text-[#97a198]">
                    {selectedQuestions.length} selected · {selectedMarks} marks
                  </span>
                </div>
                <div className="max-h-[310px] divide-y divide-[#f0f2ef] overflow-auto">
                  {questions.length ? (
                    questions.map((question) => (
                      <label
                        key={question.id}
                        className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-[#fafbf9]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.includes(question.id)}
                          onChange={() => toggleQuestion(question.id)}
                          className="mt-0.5 accent-[#526c40]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 block text-[11px] font-semibold leading-5 text-[#3d4c42]">
                            {question.questionText}
                          </span>
                          <span className="mt-1 block text-[9px] text-[#929d94]">
                            {question.difficulty} · {question.marks}{" "}
                            {question.marks === 1 ? "mark" : "marks"}
                          </span>
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-[11px] text-[#89958c]">
                      {selectedSubjectId
                        ? "No questions here yet. Add subject questions first."
                        : "Select a subject to load its questions."}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end border-t border-[#edf0eb] pt-4">
                <button
                  disabled={saving || !selectedQuestions.length}
                  className="inline-flex items-center gap-2 rounded-full bg-[#17221f] px-5 py-3 text-[11px] font-bold text-white hover:bg-[#304238] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Publishing…" : "Publish mock test"}
                  <Check size={14} />
                </button>
              </div>
            </form>
          </Panel>

          <aside className="space-y-5">
            <div className="rounded-xl bg-[#17221f] p-5 text-white">
              <div className="mb-4 grid h-9 w-9 place-items-center rounded-lg bg-[#d8f270] text-[#17221f]">
                <ShieldCheck size={18} />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-white/45">
                Library overview
              </p>
              <p className="mt-2 font-display text-[23px] font-extrabold">
                {subjects.length}{" "}
                <span className="text-[13px] font-semibold text-white/50">
                  subjects
                </span>
              </p>
              <p className="mt-1 text-[11px] text-white/55">
                {tests.length} mock tests · {questions.length} questions in
                selected subject
              </p>
            </div>
            <div className="rounded-xl border border-[#e5eae3] bg-white p-5">
              <p className="mb-3 text-[9px] font-bold uppercase tracking-[1.3px] text-[#98a19a]">
                Test access settings
              </p>
              {tests.length ? (
                <ul className="space-y-3">
                  {tests.map((test) => (
                    <li
                      key={test.id}
                      className="flex items-start justify-between gap-2.5"
                    >
                      <span className="flex min-w-0 items-start gap-2.5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#eef3e8] text-[#698252]">
                          <BookOpen size={13} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-bold text-[#3d4b42]">
                            {test.title}
                          </span>
                          <span className="mt-0.5 block text-[9px] text-[#929d94]">
                            {test.durationMinutes} min ·{" "}
                            {test.questionCount ?? 0} questions
                          </span>
                        </span>
                      </span>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => toggleTestFreeAccess(test)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold disabled:opacity-50 ${
                          test.freeAccess
                            ? "bg-[#eaf3dc] text-[#536c40]"
                            : "border border-[#e1e7df] text-[#69766f] hover:bg-[#fafbf9]"
                        }`}
                      >
                        {test.freeAccess ? "Free · Change" : "Make free"}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-[#919c93]">
                  Tests you publish will show here.
                </p>
              )}
            </div>
            <p className="flex items-start gap-2 px-1 text-[10px] leading-4 text-[#8e9990]">
              <CircleHelp size={14} className="mt-0.5 shrink-0" />A test’s
              subject is determined by the subject of its attached questions.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

function UsersDirectory({
  users,
  allUsers,
  payments,
  search,
  onSearch,
  isLoading,
}) {
  const studentCount = allUsers.filter(
    (user) => user.role === "STUDENT",
  ).length;
  const adminCount = allUsers.filter((user) => user.role === "ADMIN").length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <UserSummary label="Total accounts" value={allUsers.length} />
        <UserSummary label="Student accounts" value={studentCount} />
        <UserSummary label="Admin accounts" value={adminCount} />
      </div>
      <section className="overflow-hidden rounded-xl border border-[#e5eae3] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#edf0eb] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-[16px] font-extrabold text-[#26342b]">
              User details
            </h2>
            <p className="mt-1 text-[10px] text-[#8b968e]">
              Names, email addresses, roles, and account status.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-[300px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba49d]"
            />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search name, email, or ID"
              aria-label="Search users"
              className="h-10 w-full rounded-lg border border-[#e1e7df] bg-white pl-9 pr-3 text-[11px] outline-none focus:border-[#80964c]"
            />
          </label>
        </div>
        {isLoading ? (
          <div className="flex min-h-[180px] items-center justify-center gap-2 text-[12px] font-semibold text-[#7d8981]">
            <LoaderCircle size={16} className="animate-spin" />
            Loading users…
          </div>
        ) : users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[#fafbf9] text-[9px] font-bold uppercase tracking-[1px] text-[#8b968e]">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email address</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Purchases and payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2ef]">
                {users.map((user) => (
                  <tr key={user.id} className="text-[11px] text-[#59685e]">
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#eef3e8] text-[10px] font-bold uppercase text-[#607c4c]">
                          {user.name.trim().charAt(0) || "?"}
                        </span>
                        <span className="font-bold text-[#3d4b42]">
                          {user.name}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={13} className="text-[#9ba49d]" />
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-[#f0f3ee] px-2.5 py-1 text-[9px] font-bold text-[#59685e]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                          user.enabled
                            ? "bg-[#eaf3dc] text-[#536c40]"
                            : "bg-[#fff0eb] text-[#a6533e]"
                        }`}
                      >
                        {user.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <UserPaymentSummary
                        payments={payments.filter(
                          (payment) => payment.userId === user.id,
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-[12px] font-semibold text-[#59685e]">
              {search ? "No users match your search." : "No users found."}
            </p>
            {!search && (
              <p className="mt-1 text-[10px] text-[#8b968e]">
                User accounts will appear here when they register.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function UserPaymentSummary({ payments }) {
  if (!payments.length) {
    return <span className="text-[10px] text-[#929d94]">No purchases</span>;
  }

  return (
    <ul className="space-y-2">
      {payments.map((payment) => (
        <li key={payment.id} className="flex items-start gap-2">
          <span
            className={`mt-0.5 rounded-full px-2 py-0.5 text-[8px] font-bold ${
              payment.status === "PAID"
                ? "bg-[#eaf3dc] text-[#536c40]"
                : payment.status === "FAILED"
                  ? "bg-[#fff0eb] text-[#a6533e]"
                  : "bg-[#fff6df] text-[#97712e]"
            }`}
          >
            {payment.status}
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold text-[#3d4b42]">
              {payment.packageName}
            </span>
            <span className="mt-0.5 block text-[9px] text-[#929d94]">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: payment.currency || "INR",
              }).format((payment.amountInPaise ?? 0) / 100)}
              {payment.createdAt
                ? ` · ${new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(new Date(payment.createdAt))}`
                : ""}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function UserSummary({ label, value }) {
  return (
    <div className="rounded-xl border border-[#e5eae3] bg-white p-4">
      <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#929d94]">
        {label}
      </p>
      <p className="mt-1 font-display text-[24px] font-extrabold text-[#26342b]">
        {value}
      </p>
    </div>
  );
}

function AdminTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[10px] font-bold transition sm:px-3.5 ${active ? "bg-[#17221f] text-white" : "text-[#738078] hover:text-[#17221f]"}`}
    >
      {children}
    </button>
  );
}

function Panel({ icon: Icon, eyebrow, title, description, children }) {
  return (
    <section className="rounded-xl border border-[#e5eae3] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#edf3e7] text-[#637d51]">
          <Icon size={17} />
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[1.3px] text-[#9aa49b]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 font-display text-[16px] font-extrabold tracking-[-0.4px] text-[#26342b]">
            {title}
          </h2>
          <p className="mt-1 text-[10px] leading-4 text-[#8b968e]">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Message({ tone, onDismiss, children }) {
  const styles =
    tone === "error"
      ? "border-[#f1c4b8] bg-[#fff3ee] text-[#994a36]"
      : "border-[#cfdfc4] bg-[#f0f7e9] text-[#52713f]";
  return (
    <div
      className={`mb-5 flex items-start gap-2 rounded-lg border px-3.5 py-3 text-[11px] ${styles}`}
      role="status"
    >
      <CircleHelp size={15} className="mt-0.5 shrink-0" />
      <span className="flex-1">{children}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="font-bold"
      >
        ×
      </button>
    </div>
  );
}
