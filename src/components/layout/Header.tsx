"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { CityDropdown } from "@/components/shared/CityDropdown";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";

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
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/services" className="">
            Услуги
          </Link>
          <Link href="/tasks" className="">
            Задания
          </Link>
          <Link href="/how-it-works" className="">
            Как это работает
          </Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="default" asChild>
            <Link href="/tasks/create">Создать задание</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/become-executor">Стать исполнителем</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">Войти</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Открыть меню" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 px-0">
            <SheetHeader className="px-6 pb-2">
              <SheetTitle asChild>
                <Link href="/" className="flex items-center">
                  <Logo className="h-8" />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Мобильная навигация">
              <Link href="/services" className="">
                Услуги
              </Link>
              <Link href="/tasks" className="">
                Задания
              </Link>
              <Link href="/how-it-works" className="">
                Как это работает
              </Link>
            </nav>
            <Separator />
            <div className="flex flex-col gap-2 px-4 py-4">
              <Button className="w-full" asChild>
                <Link href="/tasks/create">Создать задание</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/become-executor">Стать исполнителем</Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">Войти</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
