"use client";

import { LogOut, ShieldCheck, User } from "lucide-react";
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
          className="flex items-center rounded-full hover:bg-accent p-1 transition-colors outline-none"
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
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Единая точка входа в личный кабинет — детальная навигация уже в сайдбаре дашборда */}
        <DropdownMenuItem asChild className="text-base font-medium py-2 px-2">
          <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            Личный кабинет
          </Link>
        </DropdownMenuItem>

        {/* Единственный вход в админку: ссылки на неё в интерфейсе не было
            вообще, адрес приходилось набирать руками. Пункт виден только
            администратору — доступ всё равно проверяет layout админки. */}
        {user.role === "admin" && (
          <DropdownMenuItem asChild className="text-base font-medium py-2 px-2">
            <Link href="/admin/listings" className="flex items-center gap-2 cursor-pointer">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              Админ-панель
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

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
