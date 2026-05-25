import Link from 'next/link'
import { ChevronRight, MapPin, Clock, Users, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { RespondButton } from '@/components/tasks/RespondButton'

type TaskStatus = 'open' | 'in_progress' | 'done'

const mockTask = {
  id: 1,
  title: 'Разработка сайта-визитки для стоматологии',
  description: 'Нужен современный сайт для стоматологической клиники. Требования: адаптивный дизайн, страницы "О нас", "Услуги", "Врачи", "Контакты". Форма записи на приём. Срок — 2 недели. Есть примеры нравящихся сайтов которые пришлю после обсуждения. Предпочтительно работать с исполнителем из Тирасполя для личных встреч.',
  budget: 'до 800 руб.',
  category: 'IT и Digital',
  city: 'Тирасполь',
  deadline: '2 недели',
  status: 'open' as TaskStatus,
  createdAt: '5 часов назад',
  userId: 'user_123', // ID автора задания
  author: {
    name: 'Марина Ковалёва',
    initials: 'МК',
    memberSince: 'марта 2025',
    tasksCount: 5,
    completedCount: 3,
  },
  responses: [
    {
      id: 1,
      userId: 'user_456',
      author: { name: 'Дмитрий Ковалёв', initials: 'ДК', rating: 4.9, reviewsCount: 43 },
      price: '600 руб.',
      text: 'Занимаюсь разработкой сайтов 5 лет. Сделаю современный адаптивный сайт с формой записи. Могу показать примеры похожих работ. Готов встретиться лично для обсуждения деталей.',
    },
    {
      id: 2,
      userId: 'user_789',
      author: { name: 'Александр М.', initials: 'АМ', rating: 4.7, reviewsCount: 28 },
      price: '750 руб.',
      text: 'Могу выполнить работу за 10 дней. Использую современный стек — Next.js, Tailwind. SEO оптимизация в комплекте.',
    },
  ],
  similarTasks: [
    { id: 2, title: 'Лендинг для строительной компании', city: 'Тирасполь', budget: 'до 500 руб.' },
    { id: 3, title: 'Интернет-магазин на WordPress', city: 'Бендеры', budget: 'до 1200 руб.' },
  ],
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

export default async function TaskDetailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const currentUserId = session?.user.id ?? null
  const isOwner = currentUserId === mockTask.userId
  const hasResponded = mockTask.responses.some((r) => r.userId === currentUserId)
  const myResponse = mockTask.responses.find((r) => r.userId === currentUserId)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Хлебные крошки */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/tasks" className="hover:text-[#0d7a5f] transition-colors">Задания</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-gray-900 font-medium line-clamp-1">{mockTask.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">

          {/* Основной контент */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Основной блок */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">

              {/* Заголовок + бюджет */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-xl font-semibold text-gray-900 leading-snug">
                  {mockTask.title}
                </h1>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-[#0d7a5f]">{mockTask.budget}</div>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center gap-2 flex-wrap mb-5">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[mockTask.status]}`}>
                  {statusLabels[mockTask.status]}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {mockTask.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <MapPin className="h-3 w-3" />
                  {mockTask.city}
                </span>
              </div>

              {/* Описание */}
              <h2 className="text-sm font-semibold text-gray-900 mb-2">Описание задания</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{mockTask.description}</p>

              {/* Детали */}
              <div className="border-t border-gray-100 pt-5 mb-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Детали</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Бюджет</p>
                    <p className="text-sm font-medium text-gray-900">{mockTask.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Срок</p>
                    <p className="text-sm font-medium text-gray-900">{mockTask.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Город</p>
                    <p className="text-sm font-medium text-gray-900">{mockTask.city}</p>
                  </div>
                </div>
              </div>

              {/* Заказчик */}
              <div className="border-t border-gray-100 pt-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Заказчик</h2>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-sm font-bold text-[#0d7a5f] flex-shrink-0">
                    {mockTask.author.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mockTask.author.name}</p>
                    <p className="text-xs text-gray-400">На платформе с {mockTask.author.memberSince}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Заданий: <span className="font-semibold text-gray-900">{mockTask.author.tasksCount}</span></span>
                  <span>Завершено: <span className="font-semibold text-gray-900">{mockTask.author.completedCount}</span></span>
                </div>
              </div>

            </div>

            {/* Блок откликов — зависит от роли */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              {/* Автор задания — видит все отклики */}
              {isOwner && (
                <>
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    Отклики ({mockTask.responses.length})
                  </h2>
                  <div className="flex flex-col gap-3">
                    {mockTask.responses.map((response) => (
                      <div key={response.id} className="border border-gray-200 rounded-xl p-4 hover:border-[#0d7a5f] transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#0d7a5f]/10 flex items-center justify-center text-xs font-bold text-[#0d7a5f] flex-shrink-0">
                              {response.author.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{response.author.name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{response.author.rating}</span>
                                <span>· {response.author.reviewsCount} отзывов</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-base font-bold text-[#0d7a5f] flex-shrink-0">
                            {response.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{response.text}</p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="h-8 px-4 text-xs bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
                            Принять отклик
                          </Button>
                          <Button size="sm" variant="outline" asChild className="h-8 px-4 text-xs border-[#0d7a5f] text-[#0d7a5f]">
                            <Link href={`/profile/${response.userId}`}>Профиль</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Исполнитель уже откликнулся */}
              {!isOwner && hasResponded && myResponse && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-[#0d7a5f]" />
                    <h2 className="text-sm font-semibold text-gray-900">Вы уже откликнулись</h2>
                  </div>
                  <div className="border border-[#0d7a5f]/30 rounded-xl p-4 bg-[#0d7a5f]/4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">Ваш отклик</p>
                      <span className="text-sm font-bold text-[#0d7a5f]">{myResponse.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{myResponse.text}</p>
                    <Button size="sm" variant="outline" className="h-8 px-4 text-xs border-[#0d7a5f] text-[#0d7a5f]">
                      Редактировать отклик
                    </Button>
                  </div>
                </>
              )}

              {/* Гость или пользователь без отклика */}
              {!isOwner && !hasResponded && (
                <>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">
                    Откликов: {mockTask.responses.length}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Откликнитесь на задание чтобы предложить свои условия заказчику
                  </p>
                  {!session ? (
                    <Button asChild className="bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
                      <Link href="/login?callbackUrl=/tasks/1">Войдите чтобы откликнуться</Link>
                    </Button>
                  ) : (
                    <RespondButton taskId={mockTask.id} />
                  )}
                </>
              )}

            </div>

          </div>

          {/* Сайдбар */}
          <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0 sticky top-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              {/* Кнопка отклика — только не владельцу и не откликнувшемуся */}
              {!isOwner && !hasResponded && (
                session ? (
                  <RespondButton taskId={mockTask.id} className="w-full mb-4" />
                ) : (
                  <Button asChild className="w-full mb-4 bg-[#0d7a5f] hover:bg-[#0a6149] text-white">
                    <Link href="/login?callbackUrl=/tasks/1">Откликнуться</Link>
                  </Button>
                )
              )}

              {/* Уже откликнулся */}
              {!isOwner && hasResponded && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-[#0d7a5f]/8 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-[#0d7a5f]" />
                  <span className="text-sm text-[#0d7a5f] font-medium">Вы откликнулись</span>
                </div>
              )}

              {/* Мета */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>Опубликовано {mockTask.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{mockTask.responses.length} откликов</span>
                </div>
              </div>

              {/* Похожие задания */}
              {mockTask.similarTasks.length > 0 && (
                <>
                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Похожие задания
                    </p>
                    <div className="flex flex-col gap-2">
                      {mockTask.similarTasks.map((task) => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className="block p-3 border border-gray-200 rounded-lg hover:border-[#0d7a5f] transition-colors group"
                        >
                          <p className="text-xs font-medium text-gray-900 group-hover:text-[#0d7a5f] transition-colors mb-1 line-clamp-2">
                            {task.title}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{task.city}</span>
                            <span className="text-[#0d7a5f] font-medium">{task.budget}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
