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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-base font-medium text-muted-foreground hover:text-brand transition-colors"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              className="text-base font-medium text-muted-foreground hover:text-brand transition-colors"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              className="text-base font-medium text-muted-foreground hover:text-brand transition-colors"
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
                  className="hidden md:inline-flex border-brand text-brand hover:bg-brand/10 font-medium"
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
                className="text-base font-medium text-muted-foreground hover:text-brand transition-colors px-2"
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