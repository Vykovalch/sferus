"use client";

import { ClipboardList, FileText, Heart, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Session } from "@/lib/auth";
import { signOut } from "@/lib/auth-client";

/**
 * Разделы личного кабинета. Порядок значимый — в нём они и показываются.
 *
 * Список лежит здесь, а не в отдельном модуле: читатель у него один.
 * Общий модуль был нужен, пока те же пункты рисовал сайдбар кабинета, —
 * сайдбар удалён 2026-09-21 как вторая навигация, и посредник вместе с ним.
 */
const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard/profile", label: "Профиль", icon: User },
  { href: "/dashboard/services", label: "Мои услуги", icon: ClipboardList },
  { href: "/dashboard/tasks", label: "Мои задания", icon: FileText },
  { href: "/dashboard/favorites", label: "Избранное", icon: Heart },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

interface UserMenuProps {
  session: Session;
}

export function UserMenu({ session }: UserMenuProps) {
  const router = useRouter();
  const user = session.user;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative tap-target flex items-center rounded-full hover:bg-accent p-1 transition-colors outline-none"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-brand/10 text-brand text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 shadow-xl">
        {/* Шапка с именем и почтой */}
        <div className="px-3 py-2">
          <p className="text-base font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Отдельного пункта «Личный кабинет» нет (решение владельца,
            2026-09-21): он вёл на `/dashboard`, а этот маршрут редиректит
            на профиль — то есть в то же место, что и «Профиль» строкой ниже.
            До 2026-09-21 пункт был единственным: детальная навигация жила
            только в сайдбаре кабинета, и попасть, скажем, в «Избранное»
            из шапки было нельзя. */}
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild className="text-base font-medium py-2 px-2">
              <Link href={item.href} className="flex items-center gap-2 cursor-pointer">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        {/* Черта после разделов кабинета (решение владельца, 2026-09-21):
            ниже неё — то, что к кабинету не относится, админка и выход. */}
        <DropdownMenuSeparator />

        {/* Единственный вход в админку: ссылки на неё в интерфейсе не было
            вообще, адрес приходилось набирать руками. Пункт виден только
            администратору — доступ всё равно проверяет layout админки.

            Своя черта идёт вместе с пунктом, а не отдельной строкой ниже:
            у обычного пользователя пункт скрыт, и две черты подряд слиплись бы
            в двойную линию. */}
        {user.role === "admin" && (
          <>
            <DropdownMenuItem asChild className="text-base font-medium py-2 px-2">
              <Link href="/admin/listings" className="flex items-center gap-2 cursor-pointer">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Админ-панель
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-base font-medium py-2 px-2 text-muted-foreground focus:text-muted-foreground cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
