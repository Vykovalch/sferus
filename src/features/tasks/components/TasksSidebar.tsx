"use client";

import { useState } from "react";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { CityFilter } from "@/components/shared/CityFilter";
import { StatusFilter } from "@/components/shared/StatusFilter";
import type { CategoryOption } from "@/features/categories/queries";
import type { CityOption } from "@/features/cities/queries";

const ALL_CITIES = "Все города";
const ALL_CATEGORIES = "Все категории";

interface TasksSidebarProps {
  /** Справочники из БД: клиентский компонент их сам получить не может. */
  cities: CityOption[];
  categories: CategoryOption[];
  idPrefix?: string;
}

export function TasksSidebar({ cities, categories, idPrefix = "desktop" }: TasksSidebarProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [activeCity, setActiveCity] = useState(ALL_CITIES);
  const [activeStatus, setActiveStatus] = useState("open");

  const cityNames = [ALL_CITIES, ...cities.map((c) => c.name)];
  const categoryNames = [ALL_CATEGORIES, ...categories.map((c) => c.name)];

  return (
    <div className="space-y-3 select-none">
      <CategoryFilter
        categories={categoryNames}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        name={`${idPrefix}-category`}
      />
      <CityFilter
        cities={cityNames}
        activeCity={activeCity}
        onChange={setActiveCity}
        name={`${idPrefix}-city`}
      />
      <StatusFilter
        activeStatus={activeStatus}
        onChange={setActiveStatus}
        name={`${idPrefix}-status`}
      />
    </div>
  );
}
