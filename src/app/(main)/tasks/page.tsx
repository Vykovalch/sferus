import { SlidersHorizontal } from 'lucide-react'
import { TasksSidebar } from '@/components/tasks/TasksSidebar'
import { TaskCard } from '@/components/tasks/TaskCard'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

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
    author: { name: 'Андрей П.', type: 'person' as const },
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
    author: { name: 'Марина К.', type: 'company' as const },
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
    author: { name: 'Елена Л.', type: 'person' as const },
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
    author: { name: 'Дмитрий В.', type: 'company' as const },
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
            <TasksSidebar idPrefix="desktop" />
          </aside>

          {/* Контентная область */}
          <div className="flex-1 min-w-0">
            {/* Панель фильтров */}
            <div className="flex items-center justify-between mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="lg:hidden h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <TasksSidebar idPrefix="mobile" />
                </SheetContent>
              </Sheet>
            </div>

            {/* Список карточек */}
            <div className="flex flex-col gap-3">
              {mockTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-center gap-2 mt-8 select-none">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="h-9 border-input text-muted-foreground"
              >
                Назад
              </Button>
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className={`w-9 h-9 p-0 font-medium cursor-pointer transition-colors ${
                    page === 1
                      ? 'bg-brand hover:bg-brand/90 text-brand-foreground shadow-sm'
                      : 'border-input text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
              >
                Вперёд
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}