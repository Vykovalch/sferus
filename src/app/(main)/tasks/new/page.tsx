import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default async function CreateTaskPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login?callbackUrl=/tasks/new')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Хлебные крошки */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/tasks" className="hover:text-[#0d7a5f] transition-colors">Задания</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">Создать задание</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <CreateTaskForm />
      </div>

    </div>
  )
}
