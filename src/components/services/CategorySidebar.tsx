"use client";

import { useState } from "react";

const subcategories = [
  { name: "Все подкатегории", count: 120 },
  { name: "Электрика", count: 34 },
  { name: "Сантехника", count: 28 },
  { name: "Отделка", count: 22 },
  { name: "Кровля", count: 15 },
  { name: "Окна и двери", count: 12 },
  { name: "Фундамент", count: 9 },
];

const cities = ["Все", "Тирасполь", "Бендеры", "Рыбница", "Дубоссары", "Слободзея"];

const executorTypes = [
  { value: "all", label: "Все исполнители" },
  { value: "individual", label: "Частный специалист" },
  { value: "company", label: "Компания" },
];

const radioBlock = (
  name: string,
  options: { value: string; label: string; count?: number }[],
  active: string,
  onChange: (v: string) => void,
) => (
  <div className="py-1">
    {options.map((opt) => (
      <label
        key={opt.value}
        className="flex items-center justify-between px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={active === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
          />
          <span
            className={`text-sm leading-snug truncate transition-colors ${
              active === opt.value
                ? "text-brand font-medium"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          >
            {opt.label}
          </span>
        </div>
        {opt.count !== undefined && (
          <span
            className={`text-xs pl-2 flex-shrink-0 transition-colors ${
              active === opt.value
                ? "text-brand/70 font-medium"
                : "text-muted-foreground/60 group-hover:text-muted-foreground"
            }`}
          >
            {opt.count}
          </span>
        )}
      </label>
    ))}
  </div>
);

export function CategorySidebar() {
  const [activeSubcat, setActiveSubcat] = useState("Все подкатегории");
  const [activeCity, setActiveCity] = useState("Все");
  const [executorType, setExecutorType] = useState("all");

  const blocks = [
    // {
    //   title: 'Подкатегория',
    //   content: radioBlock(
    //     'subcategory',
    //     subcategories.map((s) => ({ value: s.name, label: s.name, count: s.count })),
    //     activeSubcat,
    //     setActiveSubcat
    //   ),
    // },
    {
      title: "Исполнитель",
      content: radioBlock("executorType", executorTypes, executorType, setExecutorType),
    },
    {
      title: "Город",
      content: radioBlock(
        "city",
        cities.map((c) => ({ value: c, label: c })),
        activeCity,
        setActiveCity,
      ),
    },
  ];

  return (
    <div className="space-y-3 select-none">
      {blocks.map((block) => (
        <div
          key={block.title}
          className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
        >
          <div className="px-4 py-2.5 border-b border-border">
            <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {block.title}
            </h3>
          </div>
          {block.content}
        </div>
      ))}
    </div>
  );
}
