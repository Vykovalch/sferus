"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
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

      <DropdownMenuContent align="end" className="w-52 shadow-xl">
        {/* Шапка с именем и почтой */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Единая точка входа в личный кабинет — детальная навигация уже в сайдбаре дашборда */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            Личный кабинет
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-muted-foreground focus:text-muted-foreground cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
