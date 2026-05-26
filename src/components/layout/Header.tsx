import Link from "next/link";
import { MapPin } from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/UserMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Logo className="h-10 w-auto hidden sm:block" />
              <Logo compact className="h-10 w-auto sm:hidden" />
            </Link>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Тирасполь</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-base font-normal text-gray-700 hover:text-[#0d7a5f] transition-colors"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              className="text-base font-normal text-gray-700 hover:text-[#0d7a5f] transition-colors"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              className="text-base font-normal text-gray-700 hover:text-[#0d7a5f] transition-colors"
            >
              Как это работает
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
                  <Link href="/tasks/new">Создать задание</Link>
                </Button>
                <UserMenu session={session} />
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#0d7a5f] text-[#0d7a5f] hover:bg-[#0d7a5f]/10"
                >
                  <Link href="/register">Стать исполнителем</Link>
                </Button>
                <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
                  <Link href="/tasks/new">Создать задание</Link>
                </Button>
                <Link
                  href="/login"
                  className="text-base font-normal text-gray-700 hover:text-[#0d7a5f] transition-colors ml-1"
                >
                  Войти
                </Link>
              </>
            )}
          </div>

          <MobileMenu session={session} />
        </div>
      </div>
    </header>
  );
}
