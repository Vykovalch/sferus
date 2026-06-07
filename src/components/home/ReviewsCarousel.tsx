'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Review = {
  initials: string
  name: string
  role: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    initials: 'ЕП',
    name: 'Елена Петрова',
    role: 'Клиент • Тирасполь',
    rating: 5,
    text: 'Нашла отличного мастера для ремонта квартиры через Сферус. Все прошло быстро и качественно. Очень довольна результатом!',
  },
  {
    initials: 'ВС',
    name: 'Виктор Сидоров',
    role: 'Электрик • Бендеры',
    rating: 5,
    text: 'Работаю на платформе уже 3 месяца. Заказы приходят регулярно, клиенты адекватные. Отличный способ найти новых клиентов!',
  },
  {
    initials: 'МК',
    name: 'Марина Ковалева',
    role: 'Клиент • Рыбница',
    rating: 5,
    text: 'Удобная платформа с проверенными специалистами. Заказывала уборку и ремонт сантехники — все на высшем уровне. Рекомендую!',
  },
  {
    initials: 'ДВ',
    name: 'Дмитрий Волков',
    role: 'Сантехник • Тирасполь',
    rating: 5,
    text: 'Благодаря Сферусу мой доход вырос на 40%. Удобный личный кабинет, хорошая статистика. Советую всем мастерам!',
  },
  {
    initials: 'ОН',
    name: 'Ольга Николаева',
    role: 'Клиент • Дубоссары',
    rating: 5,
    text: 'Искала репетитора для дочери. Нашла за 10 минут! Очень удобный поиск и прозрачные цены. Спасибо за сервис!',
  },
  {
    initials: 'АИ',
    name: 'Александр Ильин',
    role: 'Мастер по ремонту •  Бендеры',
    rating: 5,
    text: 'Лучшая платформа для исполнителей в Приднестровье. Много заказов, никаких комиссий. Работаю с удовольствием!',
  },
]

const VISIBLE = 3

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)
  const maxIndex = reviews.length - VISIBLE

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1))

  const visible = reviews.slice(current, current + VISIBLE)

  // Создаем массив для точек навигации на основе реальных объектов отзывов,
  // чтобы использовать их имена в качестве ключей вместо индексов i
  const dotElements = reviews.slice(0, maxIndex + 1)

  // Создаем фиксированный массив для звезд (от 1 до 5), чтобы уйти от индексов
  const starValues = [1, 2, 3, 4, 5]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-3">
            Отзывы наших пользователей
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Что говорят клиенты и исполнители о платформе Сферус
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative px-0 sm:px-12">

          {/* Кнопка назад */}
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Предыдущий отзыв"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden sm:flex items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Карточки отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((review: Review) => (
              <Card
                key={review.name}
                className="flex flex-col rounded-xl border border-border bg-card text-card-foreground h-full transition-shadow duration-300 shadow-sm"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-full bg-brand/10 text-brand flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {review.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">{review.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{review.role}</p>
                    </div>
                  </div>
                  
                  {/* Звездочки рейтинга: ключ завязан на имя автора + номер звезды (1-5) */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {starValues.slice(0, review.rating).map((starNumber) => (
                      <Star 
                        key={`${review.name}-star-${starNumber}`} 
                        className="h-4 w-4 fill-amber-400 text-amber-400" 
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-foreground/90 leading-relaxed font-normal flex-1">
                    {review.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Кнопка вперёд */}
          <button
            type="button"
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Следующий отзыв"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 hidden sm:flex items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Точки навигации: ключ завязан на уникальное имя отзыва, а индекс в onClick берется из indexOf */}
          <div className="flex justify-center gap-2 mt-10">
            {dotElements.map((dotReview: Review) => {
              const dotIndex = reviews.indexOf(dotReview)
              return (
                <button
                  key={`dot-${dotReview.name}`}
                  type="button"
                  onClick={() => setCurrent(dotIndex)}
                  aria-label={`Перейти к отзыву ${dotIndex + 1}`}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    dotIndex === current
                      ? 'bg-brand w-5'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
