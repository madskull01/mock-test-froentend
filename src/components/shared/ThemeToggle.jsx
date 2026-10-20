import {
  Moon,
  Sun,
} from "lucide-react";

export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#dfe5dc] px-3 text-[11px] font-semibold text-[#43514b] transition hover:bg-[#f0f2ee]"
    >
      <Icon size={15} aria-hidden="true" />
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
