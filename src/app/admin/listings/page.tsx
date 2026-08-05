"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockListings = [
  { id: 1, title: "Электромонтажные работы любой сложности", executor: "Виктор Петров", city: "Тирасполь", active: true },
  { id: 2, title: "Установка видеонаблюдения", executor: "Виктор Петров", city: "Тирасполь", active: true },
  { id: 3, title: "Подключение электроплит", executor: "Виктор Петров", city: "Тирасполь", active: false },
  { id: 4, title: "Ремонт стиральных машин", executor: "ТехноСервис", city: "Тирасполь", active: true },
  { id: 5, title: "Ремонт холодильников на дому", executor: "ТехноСервис", city: "Тирасполь", active: true },
];

export default function AdminListingsPage() {
  const [listings, setListings] = useState(mockListings);

  function toggleActive(id: number) {
    // TODO: заменить на Server Action при подключении БД
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  }

  function remove(id: number) {
    // TODO: заменить на Server Action при подключении БД
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-1">Объявления</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Модерация объявлений услуг: скрытие и удаление
      </p>

      {listings.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет объявлений
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <div
              key={l.id}
              className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/services/listing/${l.id}`}
                  className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-1"
                >
                  {l.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {l.executor} · {l.city}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  l.active
                    ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {l.active ? "Активно" : "Скрыто"}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleActive(l.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={l.active ? "Скрыть объявление" : "Показать объявление"}
                >
                  {l.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(l.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                  aria-label="Удалить объявление"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
