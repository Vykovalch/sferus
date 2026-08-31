"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Session } from "@/lib/auth";

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
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 border-secondary text-secondary hover:bg-secondary hover:text-white font-semibold transition-colors"
                >
                  <Link href="/services/new" onClick={handleClose}>
                    Создать услугу
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-10 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors"
                >
                  <Link href="/tasks/new" onClick={handleClose}>
                    Создать задание
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
