export function groupSubjectsBySection(subjects, sections = []) {
  const grouped = new Map();
  sections.forEach((section) => {
    const rawName = section.name?.trim();
    const namedSection = rawName?.match(/^section[\s_-]*(.*)$/i);
    const sectionName = !rawName
      ? "Other subjects"
      : namedSection
        ? `Section ${namedSection[1] || rawName}`
        : `Section ${rawName}`;
    grouped.set(section.id, {
      id: section.id,
      name: sectionName,
      subjects: [],
    });
  });
  subjects.forEach((subject) => {
    const sectionId = subject.sectionId ?? "other";
    if (!grouped.has(sectionId)) {
      const rawName = subject.sectionName?.trim();
      const namedSection = rawName?.match(/^section[\s_-]*(.*)$/i);
      const sectionName = !rawName
        ? "Other subjects"
        : namedSection
          ? `Section ${namedSection[1] || rawName}`
          : `Section ${rawName}`;
      grouped.set(sectionId, {
        id: sectionId,
        name: sectionName,
        subjects: [],
      });
    }
    grouped.get(sectionId).subjects.push(subject);
  });
  return [...grouped.values()].sort((left, right) => {
    const sectionOrder = (name) => {
      const match = name.match(/^Section\s+([ABC])$/i);
      return match ? "ABC".indexOf(match[1].toUpperCase()) : 3;
    };
    return (
      sectionOrder(left.name) - sectionOrder(right.name) ||
      left.name.localeCompare(right.name)
    );
  });
}

export function formatDate(value) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}
