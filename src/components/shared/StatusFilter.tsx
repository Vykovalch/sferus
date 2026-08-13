"use client";

import { TASK_STATUSES } from "@/lib/constants";

// Источник — pg-enum task_status. Статуса in_progress в v1 нет: он подразумевает
// известного исполнителя, а связи задания с исполнителем без откликов не существует.
const statuses = Object.entries(TASK_STATUSES).map(([value, label]) => ({ value, label }));

interface StatusFilterProps {
  activeStatus: string;
  onChange: (value: string) => void;
  name?: string;
}

export function StatusFilter({ activeStatus, onChange, name = "status" }: StatusFilterProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Статус
        </h3>
      </div>
      <div className="py-1">
        {statuses.map((status) => (
          <label
            key={status.value}
            className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
          >
            <input
              type="radio"
              name={name}
              value={status.value}
              checked={activeStatus === status.value}
              onChange={() => onChange(status.value)}
              className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
            />
            <span
              className={`text-sm transition-colors ${
                activeStatus === status.value
                  ? "text-brand font-medium"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {status.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
