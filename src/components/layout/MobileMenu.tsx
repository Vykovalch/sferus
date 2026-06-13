"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { Session } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  session: Session | null;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className="md:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Открыть меню"
            className="text-muted-foreground hover:text-foreground transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-72 px-0 py-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>

          <nav className="px-4 py-6 flex flex-col gap-1">
            <Link
              href="/services"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              onClick={handleClose}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2 px-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Как это работает
            </Link>

            {session && (
              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-3">
                <Link
                  href="/services/new"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Создать услугу
                </Link>
                <Link
                  href="/tasks/new"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Создать задание
                </Link>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}