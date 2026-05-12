import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { CityDropdown } from "@/components/shared/CityDropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Logo className="h-10 hidden sm:block" />
            <Logo compact className="h-10 sm:hidden" />
          </Link>
          <CityDropdown />
        </div>
        <nav className="hidden md:flex items-center gap-6">Навигация</nav>
        <div className="flex items-center gap-2">Кнопки действий</div>
      </div>
    </header>
  );
}