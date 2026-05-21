'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import type { Session } from '@/lib/auth'

interface MobileMenuProps {
  session: Session | null
}

export function MobileMenu({ session }: MobileMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-700 p-1"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/services" onClick={() => setOpen(false)} className="text-base text-gray-700 hover:text-[#0d7a5f]">
              Услуги
            </Link>
            <Link href="/tasks" onClick={() => setOpen(false)} className="text-base text-gray-700 hover:text-[#0d7a5f]">
              Задания
            </Link>
            <Link href="/#how-it-works" onClick={() => setOpen(false)} className="text-base text-gray-700 hover:text-[#0d7a5f]">
              Как это работает
            </Link>

            <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-base text-gray-700 hover:text-[#0d7a5f]">
                    Личный кабинет
                  </Link>
                  <Link
                    href="/tasks/new"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-md bg-[#0d7a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a6149]"
                  >
                    Создать задание
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="text-base text-gray-700 hover:text-[#0d7a5f]">
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-md border border-[#0d7a5f] px-4 py-2 text-sm font-medium text-[#0d7a5f] hover:bg-[#0d7a5f]/10"
                  >
                    Стать исполнителем
                  </Link>
                  <Link
                    href="/tasks/new"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-md bg-[#0d7a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a6149]"
                  >
                    Создать задание
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}