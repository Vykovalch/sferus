import { ChevronRight, MapPin, Star, Building2, User } from 'lucide-react'
import { Hammer } from 'lucide-react'
import Link from 'next/link'
import { CategorySidebar } from '@/components/services/CategorySidebar'
import { ServiceCard } from '@/components/services/ServiceCard'

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
    <div className="min-h-screen bg-gray-50">

      {/* Шапка категории */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-5">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Link href="/services" className="hover:text-[#0d7a5f] transition-colors">
              Услуги
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-gray-900 font-medium">Строительство и ремонт</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#0d7a5f]/10 flex items-center justify-center flex-shrink-0">
              <Hammer className="h-5 w-5 text-[#0d7a5f]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Строительство и ремонт</h1>
              <p className="text-sm text-gray-500">120 объявлений</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar />
          </aside>

          {/* Контент */}
          <div className="flex-1 min-w-0">

            {/* Шапка контента */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Найдено <span className="font-semibold text-gray-900">120</span> объявлений
              </p>
              <div className="flex items-center gap-3">
                {/* Фильтры на мобильном */}
                <button
                  type="button"
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-[#0d7a5f] transition-colors bg-white"
                >
                  Фильтры
                </button>
                {/* Сортировка */}
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-[#0d7a5f] transition-colors bg-white"
                >
                  По рейтингу
                  <ChevronRight className="h-3.5 w-3.5 rotate-90 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
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
              {[1, 2, 3, 4, 5].map((page) => (
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
