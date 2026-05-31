'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Megaphone, ListChecks, MessageSquare, User, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import { Logo } from '@/components/shared/Logo'

interface DashboardSidebarProps {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

const navItems = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/listings', label: 'Мои объявления', icon: Megaphone },
  { href: '/dashboard/tasks', label: 'Мои задания', icon: ListChecks },
  { href: '/dashboard/responses', label: 'Отклики', icon: MessageSquare, badge: 3 },
  { href: '/dashboard/profile', label: 'Профиль', icon: User },
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 min-h-screen">

      {/* Лого */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Link href="/">
          <Logo className="h-8" />
        </Link>
      </div>

      {/* Пользователь */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-sm font-bold text-[#0d7a5f] flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#0d7a5f]/10 text-[#0d7a5f] font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-[#0d7a5f]' : 'text-gray-400'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Выйти */}
      <div className="px-2 py-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Выйти</span>
        </button>
      </div>

    </aside>
  )
}
