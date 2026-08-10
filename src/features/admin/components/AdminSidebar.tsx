"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/listings", label: "Объявления", icon: Megaphone },
  { href: "/admin/tasks", label: "Задания", icon: FileText },
  { href: "/admin/users", label: "Пользователи", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Десктоп: вертикальный сайдбар */}
      <nav
        aria-label="Админ-панель"
        className="hidden lg:flex flex-col gap-1 bg-background border border-border rounded-xl p-2 shadow-sm"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Мобильный: горизонтальные вкладки */}
      <nav
        aria-label="Админ-панель"
        className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                isActive
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
