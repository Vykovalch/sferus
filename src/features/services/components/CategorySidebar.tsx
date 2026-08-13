"use client";

import { useState } from "react";
import { CityFilter } from "@/components/shared/CityFilter";
import { ExecutorFilter } from "@/components/shared/ExecutorFilter";
import type { CityOption } from "@/features/cities/queries";

const ALL_CITIES = "Все города";

interface CategorySidebarProps {
  /** Города из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  idPrefix?: string;
}

export function CategorySidebar({ cities, idPrefix = "desktop" }: CategorySidebarProps) {
  const [activeCity, setActiveCity] = useState(ALL_CITIES);
  const [executorType, setExecutorType] = useState("all");

  const cityNames = [ALL_CITIES, ...cities.map((c) => c.name)];

  return (
    <div className="space-y-3 select-none">
      <ExecutorFilter
        activeExecutor={executorType}
        onChange={setExecutorType}
        name={`${idPrefix}-executorType`}
      />
      <CityFilter
        cities={cityNames}
        activeCity={activeCity}
        onChange={setActiveCity}
        name={`${idPrefix}-city`}
      />
    </div>
  );
}
