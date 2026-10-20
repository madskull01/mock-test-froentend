

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold text-[#56645b]">
        {label}
      </span>
      {children}
    </label>
  );
}
