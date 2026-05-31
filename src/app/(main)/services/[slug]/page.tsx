'use client'

import { ChevronRight, MapPin, Star, Building2, User, Hammer } from 'lucide-react'
import Link from 'next/link'
import { CategorySidebar } from '@/components/services/CategorySidebar'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Button } from '@/components/ui/button'

// Временные данные — позже заменить на запросы к БД
const mockServices = [
  {
    id: 1,
    title: 'Электромонтажные работы любой сложности',
    subcategory: 'Электрика',
    executor: { name: 'Виктор Петров', initials: 'ВП', type: 'individual' as const, rating: 4.9, reviewsCount: 127 },
    city: 'Тирасполь',
    price: 80,
  },
  {
    id: 2,
    title: 'Ремонт и замена труб, установка сантехники',
    subcategory: 'Сантехника',
    executor: { name: 'СтройМастер ООО', initials: 'СМ', type: 'company' as const, rating: 5, reviewsCount: 89 },
    city: 'Бендеры',
    price: 100,
  },
  {
    id: 3,
    title: 'Штукатурка, шпаклёвка, покраска стен',
    subcategory: 'Отделка',
    executor: { name: 'Дмитрий Ковалёв', initials: 'ДК', type: 'individual' as const, rating: 4.8, reviewsCount: 56 },
    city: 'Тирасполь',
    price: 150,
  },
  {
    id: 4,
    title: 'Кровельные работы, ремонт крыши',
    subcategory: 'Кровля',
    executor: { name: 'КровляПро', initials: 'КП', type: 'company' as const, rating: 4.7, reviewsCount: 34 },
    city: 'Рыбница',
    price: 200,
  },
  {
    id: 5,
    title: 'Установка и ремонт окон и дверей',
    subcategory: 'Окна и двери',
    executor: { name: 'Олег Васильев', initials: 'ОВ', type: 'individual' as const, rating: 4.9, reviewsCount: 43 },
    city: 'Тирасполь',
    price: 120,
  },
  {
    id: 6,
    title: 'Заливка фундамента, бетонные работы',
    subcategory: 'Фундамент',
    executor: { name: 'БетонСтрой', initials: 'БС', type: 'company' as const, rating: 4.6, reviewsCount: 28 },
    city: 'Бендеры',
    price: 300,
  },
]

export default function CategoryPage() {
  return (
    // Изменено: Установлены системные цвета фона вместо bg-gray-50
    <div className="min-h-screen bg-background text-foreground">

      {/* Шапка категории */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4 select-none">
            <Link 
              href="/services" 
              className="hover:text-brand transition-colors font-medium cursor-pointer"
            >
              Услуги
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">Строительство и ремонт</span>
          </nav>
          
          <div className="flex items-center gap-3">
            {/* Иконка категории с безопасным брендовым фоном */}
            <div className="w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
              <Hammer className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h1 className="text-xl font-medium tracking-tight">Строительство и ремонт</h1>
              <p className="text-xs text-muted-foreground mt-0.5">120 объявлений</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Сайдбар (скрыт на мобильных) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar />
          </aside>

          {/* Контентная область */}
          <div className="flex-1 min-w-0">

            {/* Шапка контента (Панель сортировки) */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-muted-foreground">
                Найдено <span className="text-foreground font-semibold">120</span> объявлений
              </p>
              <div className="flex items-center gap-2">
                {/* Фильтры на мобильном переведены на Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="lg:hidden h-9 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                >
                  Фильтры
                </Button>
                {/* Сортировка переведена на Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                >
                  По рейтингу
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground/60" />
                </Button>
              </div>
            </div>

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-center gap-2 mt-10 select-none">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="h-9 border-input text-muted-foreground"
              >
                Назад
              </Button>
              
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant={page === 1 ? 'default' : 'outline'}
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