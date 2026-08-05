"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Trash2, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAdminTasks = [
  { id: 1, title: "Разработка сайта-визитки для стоматологии", author: "Марина Ковалёва", city: "Тирасполь", active: true },
  { id: 2, title: "Лендинг для строительной компании", author: "Марина Ковалёва", city: "Тирасполь", active: true },
  { id: 3, title: "Интернет-магазин на WordPress", author: "Марина Ковалёва", city: "Бендеры", active: true },
];

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState(mockAdminTasks);

  function toggleActive(id: number) {
    // TODO: заменить на Server Action при подключении БД
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  }

  function remove(id: number) {
    // TODO: заменить на Server Action при подключении БД
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-1">Задания</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Модерация опубликованных заданий: скрытие и удаление
      </p>

      {tasks.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет заданий
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/tasks/${t.id}`}
                  className="text-sm font-medium text-foreground hover:text-brand transition-colors line-clamp-1"
                >
                  {t.title}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.author} · {t.city}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  t.active
                    ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t.active ? "Активно" : "Скрыто"}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleActive(t.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label={t.active ? "Скрыть задание" : "Показать задание"}
                >
                  {t.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(t.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                  aria-label="Удалить задание"
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
