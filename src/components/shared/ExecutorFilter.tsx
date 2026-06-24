"use client";

const executorTypes = [
  { value: "all", label: "Все исполнители" },
  { value: "individual", label: "Частный специалист" },
  { value: "company", label: "Компания" },
];

interface ExecutorFilterProps {
  activeExecutor: string;
  onChange: (value: string) => void;
  name?: string;
}

export function ExecutorFilter({ activeExecutor, onChange, name = "executorType" }: ExecutorFilterProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Исполнитель
        </h3>
      </div>
      <div className="py-1">
        {executorTypes.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={activeExecutor === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
            />
            <span className={`text-sm leading-snug transition-colors ${
              activeExecutor === opt.value
                ? "text-brand font-medium"
                : "text-muted-foreground group-hover:text-foreground"
            }`}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}