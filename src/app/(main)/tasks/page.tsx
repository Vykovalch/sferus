import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TasksSidebar } from '@/components/tasks/TasksSidebar'
import { TaskCard } from '@/components/tasks/TaskCard'
import { Button } from '@/components/ui/button'

const mockTasks = [
  {
    id: 1,
    title: 'Нужен электрик для замены проводки в квартире',
    description: 'Квартира 3-комнатная, нужно полностью заменить проводку, установить новый щиток и розетки. Работа срочная, желательно начать на этой неделе.',
    category: 'Строительство и ремонт',
    city: 'Тирасполь',
    budget: 'до 500 руб.',
    status: 'open' as const,
    responsesCount: 3,
    createdAt: '2 часа назад',
    author: { name: 'Андрей П.', initials: 'АП' },
  },
  {
    id: 2,
    title: 'Разработка сайта-визитки для стоматологии',
    description: 'Нужен современный сайт для стоматологической клиники. Дизайн, вёрстка, адаптив. Срок — 2 недели. Есть примеры нравящихся сайтов.',
    category: 'IT и Digital',
    city: 'Тирасполь',
    budget: 'до 800 руб.',
    status: 'open' as const,
    responsesCount: 7,
    createdAt: '5 часов назад',
    author: { name: 'Марина К.', initials: 'МК' },
  },
  {
    id: 3,
    title: 'Репетитор по английскому для ребёнка 10 лет',
    description: 'Ищу репетитора по английскому языку для ребёнка 10 лет. Уровень — начинающий. Занятия 2 раза в неделю, онлайн или на дому в Бендерах.',
    category: 'Образование и обучение',
    city: 'Бендеры',
    budget: 'Договорная',
    status: 'open' as const,
    responsesCount: 2,
    createdAt: '1 день назад',
    author: { name: 'Елена Л.', initials: 'ЕЛ' },
  },
  {
    id: 4,
    title: 'Уборка офиса 200 кв.м. еженедельно',
    description: 'Ищем клининговую компанию или специалиста для еженедельной уборки офиса. Офис 200 кв.м., 2 этаж, есть всё необходимое оборудование.',
    category: 'Дом, быт и уход',
    city: 'Тирасполь',
    budget: 'до 300 руб./раз',
    status: 'open' as const,
    responsesCount: 5,
    createdAt: '2 дня назад',
    author: { name: 'Дмитрий В.', initials: 'ДВ' },
  },
]

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Шапка */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Задания</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Открытые задания от клиентов — откликайтесь и предлагайте условия
              </p>
            </div>
            <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
              <Link href="/tasks/new">+ Создать задание</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TasksSidebar />
          </aside>

          {/* Контент */}
          <div className="flex-1 min-w-0">

            {/* Шапка контента */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Найдено <span className="font-semibold text-gray-900">50</span> заданий
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-[#0d7a5f] transition-colors bg-white"
                >
                  Фильтры
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-[#0d7a5f] transition-colors bg-white"
                >
                  Сначала новые
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Список заданий */}
            <div className="flex flex-col gap-3">
              {mockTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                type="button"
                disabled
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-400 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                    page === 1
                      ? 'bg-[#0d7a5f] border-[#0d7a5f] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-[#0d7a5f] hover:text-[#0d7a5f]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:border-[#0d7a5f] hover:text-[#0d7a5f] transition-colors"
              >
                Вперёд
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
