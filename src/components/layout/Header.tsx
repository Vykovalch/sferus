import Link from "next/link";
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
    <header className="sticky top-0 z-50 w-full border-b-2 border-primary bg-[#272727]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              {/* Изменено: h-10 заменено на h-11 для дополнительной высоты вытянутого текста,
                  и добавлена фиксированная ширина w-28, чтобы буквы гарантированно помещались */}
              <Logo className="h-11 w-28" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-base font-medium text-white/90 hover:text-white transition-colors"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              className="text-base font-medium text-white/90 hover:text-white transition-colors"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              className="text-base font-medium text-white/90 hover:text-white transition-colors"
            >
              Как это работает
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {session ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="hidden md:inline-flex border-white/30 text-white hover:bg-white/10 hover:text-white font-medium bg-transparent"
                >
                  <Link href="/services/new">Создать услугу</Link>
                </Button>

                <Button
                  asChild
                  className="hidden md:inline-flex bg-brand hover:bg-brand/90 text-brand-foreground font-medium"
                >
                  <Link href="/tasks/new">Создать задание</Link>
                </Button>

                <UserMenu session={session} />
              </>
            ) : (
              <Link
                href="/login"
                className="text-base font-medium text-white/90 hover:text-white transition-colors px-2"
              >
                Войти
              </Link>
            )}

            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
