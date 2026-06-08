"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Session } from "@/lib/auth";

interface MobileMenuProps {
  session: Session | null;
}

export function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute top-8 left-auto right-0 w-screen max-w-xs bg-background border border-border rounded-xl shadow-xl z-40">
          <nav className="px-4 py-4 flex flex-col gap-1">
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2"
            >
              Услуги
            </Link>
            <Link
              href="/tasks"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2"
            >
              Задания
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setOpen(false)}
              className="text-base font-medium text-foreground hover:text-brand transition-colors py-2"
            >
              Как это работает
            </Link>

            {session && (
              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-3">
                <Link
                  href="/services/new"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/10 transition-colors"
                >
                  Создать услугу
                </Link>
                <Link
                  href="/tasks/new"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
                >
                  Создать задание
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}