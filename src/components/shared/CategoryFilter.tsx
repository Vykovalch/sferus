"use client";

import { useState } from "react";

const VISIBLE_CATS = 7

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  name?: string;
}

export function CategoryFilter({ categories, activeCategory, onChange, name = "category" }: CategoryFilterProps) {
  const [showAllCats, setShowAllCats] = useState(false)

  const visibleCats = showAllCats ? categories : categories.slice(0, VISIBLE_CATS)

  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border">
        <h3 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Категория
        </h3>
      </div>
      <div className="py-1">
        {visibleCats.map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-2.5 px-4 py-2 cursor-pointer group transition-colors hover:bg-muted/40"
          >
            <input
              type="radio"
              name={name}
              value={cat}
              checked={activeCategory === cat}
              onChange={() => onChange(cat)}
              className="h-4 w-4 border-input text-brand bg-background focus:ring-brand accent-brand cursor-pointer flex-shrink-0"
            />
            <span className={`text-sm leading-snug transition-colors ${
              activeCategory === cat
                ? "text-brand font-medium"
                : "text-muted-foreground group-hover:text-foreground"
            }`}>
              {cat}
            </span>
          </label>
        ))}
        <button
          type="button"
          onClick={() => setShowAllCats((v) => !v)}
          className="w-full text-left px-4 py-2 text-xs font-medium text-muted-foreground hover:text-brand cursor-pointer transition-colors"
        >
          {showAllCats ? "Скрыть ↑" : "Все категории ↓"}
        </button>
      </div>
    </div>
  );
}