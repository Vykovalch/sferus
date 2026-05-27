"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          className="flex items-center gap-2 rounded-full hover:bg-accent p-1 pr-2 transition-colors outline-none"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-brand/10 text-brand text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium text-foreground hidden lg:block">
            {user.name.split(" ")[0]}
          </span>

          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 shadow-xl">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 cursor-pointer text-foreground hover:text-brand"
          >
            <LayoutDashboard className="h-4 w-4" />
            Личный кабинет
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 cursor-pointer text-foreground hover:text-brand"
          >
            <User className="h-4 w-4" />
            Настройки профиля
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
