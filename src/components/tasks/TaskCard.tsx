import Link from 'next/link'
import { MapPin, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

type TaskStatus = 'open' | 'in_progress' | 'done'

interface TaskCardProps {
  task: {
    id: number
    title: string
    description: string
    category: string
    city: string
    budget: string
    status: TaskStatus
    responsesCount: number
    createdAt: string
    author: { name: string; initials: string }
  }
}

const statusLabels: Record<TaskStatus, string> = {
  open: 'Открыто',
  in_progress: 'В работе',
  done: 'Завершено',
}

const statusColors: Record<TaskStatus, string> = {
  open: 'bg-green-50 text-green-700',
  in_progress: 'bg-blue-50 text-blue-700',
  done: 'bg-gray-100 text-gray-600',
}

const responsesLabel = (count: number) => {
  if (count === 1) return '1 отклик'
  if (count >= 2 && count <= 4) return `${count} отклика`
  return `${count} откликов`
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0d7a5f] hover:shadow-sm transition-all duration-200 group">

      {/* Заголовок + бюджет */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-base font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors leading-snug"
        >
          {task.title}
        </Link>
        <span className="text-base font-semibold text-[#0d7a5f] whitespace-nowrap flex-shrink-0">
          {task.budget}
        </span>
      </div>

      {/* Описание */}
      <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Мета */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {task.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          <span>{task.city}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{task.createdAt}</span>
        </div>
      </div>

      {/* Футер */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-xs font-semibold text-[#0d7a5f]">
            {task.author.initials}
          </div>
          <span className="text-xs text-gray-500">{task.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{responsesLabel(task.responsesCount)}</span>
          </div>
          <Button
            size="sm"
            className="h-8 px-4 text-xs bg-[#0d7a5f] hover:bg-[#0a6149] text-white"
          >
            Откликнуться
          </Button>
        </div>
      </div>

    </div>
  )
}