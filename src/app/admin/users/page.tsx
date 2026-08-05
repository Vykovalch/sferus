"use client";

import { useState } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { USER_ROLES } from "@/lib/constants";

const mockUsers = [
  { id: 1, name: "Виктор Петров", email: "viktor.petrov@example.com", role: "EXECUTOR" as const, registeredAt: "12 янв. 2026", blocked: false },
  { id: 2, name: "Марина Ковалёва", email: "marina.k@example.com", role: "CLIENT" as const, registeredAt: "3 мар. 2026", blocked: false },
  { id: 3, name: "ТехноСервис", email: "info@technoservice.example", role: "EXECUTOR" as const, registeredAt: "15 мар. 2024", blocked: false },
  { id: 4, name: "Дмитрий Ковалёв", email: "dmitry.k@example.com", role: "BOTH" as const, registeredAt: "20 апр. 2026", blocked: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);

  function toggleBlocked(id: number) {
    // TODO: заменить на Server Action при подключении БД
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)));
  }

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-1">Пользователи</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Список зарегистрированных пользователей, блокировка доступа
      </p>

      {users.length === 0 ? (
        <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center text-sm text-muted-foreground">
          Нет пользователей
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => {
            const initials = u.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={u.id}
                className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-sm font-bold text-brand flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground flex-shrink-0">
                  {USER_ROLES[u.role]}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0 hidden sm:block">
                  {u.registeredAt}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    u.blocked
                      ? "bg-destructive/10 text-destructive"
                      : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  }`}
                >
                  {u.blocked ? "Заблокирован" : "Активен"}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleBlocked(u.id)}
                  className={`h-8 w-8 cursor-pointer flex-shrink-0 ${
                    u.blocked
                      ? "text-muted-foreground hover:text-green-600"
                      : "text-muted-foreground hover:text-destructive"
                  }`}
                  aria-label={u.blocked ? "Разблокировать пользователя" : "Заблокировать пользователя"}
                >
                  {u.blocked ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
