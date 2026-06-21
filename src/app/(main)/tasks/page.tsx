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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Задания</h1>
        <div className="flex gap-6">
          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <TasksSidebar />
          </aside>
          {/* Контентная область */}
          <div className="flex-1 min-w-0">
            {/* Панель сортировки и фильтров */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Найдено <span className="font-medium text-foreground">50</span> заданий
              </p>
              <div className="flex items-center gap-2.5">
                {/* Мобильная кнопка фильтров */}
                <button
                  type="button"
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted hover:text-foreground transition-colors bg-background text-muted-foreground cursor-pointer font-medium"
                >
                  Фильтры
                </button>
                {/* Кнопка сортировки */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted hover:text-foreground transition-colors bg-background text-muted-foreground cursor-pointer font-medium"
                >
                  <span>Сначала новые</span>
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground/70" />
                </button>
              </div>
            </div>
            {/* Список карточек */}
            <div className="flex flex-col gap-3">
              {mockTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            {/* Пагинация */}
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 text-sm rounded-lg border border-border text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Назад
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`w-8.5 h-8.5 text-sm rounded-lg border transition-colors cursor-pointer font-medium flex items-center justify-center ${
                    page === 1
                      ? 'bg-brand border-brand text-brand-foreground shadow-sm'
                      : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer font-medium"
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