"use client";

import { useState } from "react";
import { CityFilter } from "@/components/shared/CityFilter";
import { ExecutorFilter } from "@/components/shared/ExecutorFilter";

const cities = ["Все города", "Тирасполь", "Бендеры", "Рыбница", "Дубоссары", "Слободзея"];

interface CategorySidebarProps {
  idPrefix?: string;
}

export function CategorySidebar({ idPrefix = "desktop" }: CategorySidebarProps) {
  const [activeCity, setActiveCity] = useState("Все города");
  const [executorType, setExecutorType] = useState("all");

  return (
    <div className="space-y-3 select-none">
      <ExecutorFilter
        activeExecutor={executorType}
        onChange={setExecutorType}
        name={`${idPrefix}-executorType`}
      />
      <CityFilter
        cities={cities}
        activeCity={activeCity}
        onChange={setActiveCity}
        name={`${idPrefix}-city`}
      />
    </div>
  );
}