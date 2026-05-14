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
  gradient: string
}

const reviews: Review[] = [
  {
    initials: 'ЕП',
    name: 'Елена Петрова',
    role: 'Клиент • Тирасполь',
    rating: 5,
    text: 'Нашла отличного мастера для ремонта квартиры через Сферус. Все прошло быстро и качественно. Очень довольна результатом!',
    gradient: 'from-[#7EBFB3] to-[#7EBFB3]',
  },
  {
    initials: 'ВС',
    name: 'Виктор Сидоров',
    role: 'Электрик • Бендеры',
    rating: 5,
    text: 'Работаю на платформе уже 3 месяца. Заказы приходят регулярно, клиенты адекватные. Отличный способ найти новых клиентов!',
    gradient: 'from-[#9B8CB4] to-[#9B8CB4]',
  },
  {
    initials: 'МК',
    name: 'Марина Ковалева',
    role: 'Клиент • Рыбница',
    rating: 5,
    text: 'Удобная платформа с проверенными специалистами. Заказывала уборку и ремонт сантехники — все на высшем уровне. Рекомендую!',
    gradient: 'from-[#7EBFB3] to-[#9B8CB4]',
  },
  {
    initials: 'ДВ',
    name: 'Дмитрий Волков',
    role: 'Сантехник • Тирасполь',
    rating: 5,
    text: 'Благодаря Сферусу мой доход вырос на 40%. Удобный личный кабинет, хорошая статистика. Советую всем мастерам!',
    gradient: 'from-[#9B8CB4] to-[#7EBFB3]',
  },
  {
    initials: 'ОН',
    name: 'Ольга Николаева',
    role: 'Клиент • Дубоссары',
    rating: 5,
    text: 'Искала репетитора для дочери. Нашла за 10 минут! Очень удобный поиск и прозрачные цены. Спасибо за сервис!',
    gradient: 'from-[#7EBFB3] to-[#7EBFB3]',
  },
  {
    initials: 'АИ',
    name: 'Александр Ильин',
    role: 'Мастер по ремонту • Бендеры',
    rating: 5,
    text: 'Лучшая платформа для исполнителей в Приднестровье. Много заказов, никаких комиссий. Работаю с удовольствием!',
    gradient: 'from-[#9B8CB4] to-[#9B8CB4]',
  },
]

const VISIBLE = 3

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)
  const maxIndex = reviews.length - VISIBLE

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1))

  const visible = reviews.slice(current, current + VISIBLE)

  return (
    <section className="py-20 bg-gradient-to-br from-[#9B8CB4]/15 via-[#9B8CB4]/8 to-[#9B8CB4]/12">
      <div className="container mx-auto px-4">

        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Отзывы наших пользователей
          </h2>
          <p className="text-xl text-gray-600">
            Что говорят клиенты и исполнители о платформе Сферус
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative px-12">

          {/* Кнопка назад */}
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Предыдущий отзыв"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-[#9B8CB4]/40 bg-white hover:bg-[#9B8CB4]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="h-5 w-5 text-[#9B8CB4]" />
          </button>

          {/* Карточки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map((review) => (
              <Card
                key={review.name}
                className="flex flex-col rounded-xl hover:shadow-lg transition-all border-2 h-full"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}
                    >
                      {review.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{review.name}</h4>
                      <p className="text-sm text-gray-600">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static stars list
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
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
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full border border-[#9B8CB4]/40 bg-white hover:bg-[#9B8CB4]/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="h-5 w-5 text-[#9B8CB4]" />
          </button>

          {/* Точки навигации */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: static dots list
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Перейти к отзыву ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current
                    ? 'bg-[#9B8CB4] opacity-100 scale-125'
                    : 'bg-[#9B8CB4] opacity-40'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
