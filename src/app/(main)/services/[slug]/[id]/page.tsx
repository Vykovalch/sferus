import Link from 'next/link'
import { ChevronRight, MapPin, Star, Shield, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ServiceGallery } from '@/components/services/ServiceGallery'

type ExecutorType = 'individual' | 'company'

// Временные данные — позже заменить на запросы к БД
const mockListing = {
  id: 1,
  title: 'Электромонтажные работы любой сложности',
  description: 'Выполняю все виды электромонтажных работ: замена проводки, установка розеток и выключателей, монтаж щитков, подключение бытовой техники. Работаю аккуратно и качественно, даю гарантию на все виды работ. Опыт более 10 лет. Выезд в любую точку Тирасполя и пригорода.',
  price: 80,
  priceUnit: 'час',
  category: 'Строительство и ремонт',
  subcategory: 'Электрика',
  city: 'Тирасполь',
  experience: 'Более 10 лет',
  homeVisit: true,
  images: [
    '/usluga1.jpg',
    '/usluga2.jpg',
    '/usluga3.jpg',
  ],
  executor: {
    name: 'Виктор Петров',
    initials: 'ВП',
    type: 'individual' as ExecutorType,
    rating: 4.9,
    reviewsCount: 127,
    listingsCount: 3,
    memberSince: 'января 2025',
    verified: true,
  },
  otherListings: [
    { id: 2, title: 'Установка видеонаблюдения', price: 200 },
    { id: 3, title: 'Подключение электроплит', price: 50 },
  ],
  reviews: [
    {
      id: 1,
      author: { name: 'Андрей П.', initials: 'АП' },
      rating: 5,
      date: '15 мая 2026',
      text: 'Отличный специалист! Сделал всё быстро и качественно. Заменил проводку во всей квартире за один день. Рекомендую!',
    },
    {
      id: 2,
      author: { name: 'Марина К.', initials: 'МК' },
      rating: 5,
      date: '3 мая 2026',
      text: 'Виктор очень профессиональный мастер. Установил щиток и розетки, всё работает отлично. Цена адекватная.',
    },
    {
      id: 3,
      author: { name: 'Дмитрий В.', initials: 'ДВ' },
      rating: 4,
      date: '28 апреля 2026',
      text: 'Хорошая работа, приехал вовремя, всё объяснил. Небольшая задержка по времени но результат отличный.',
    },
  ],
}

export default function ServiceListingPage() {
  const { executor } = mockListing
  const isCompany = executor.type === 'company'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Хлебные крошки */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
            <Link href="/services" className="hover:text-[#0d7a5f] transition-colors">Услуги</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <Link href="/services/stroitelstvo-i-remont" className="hover:text-[#0d7a5f] transition-colors">
              {mockListing.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-gray-900 font-medium line-clamp-1">{mockListing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">

          {/* Основной контент */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Основной блок */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6">

                {/* Заголовок + цена */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-xl font-semibold text-gray-900 leading-snug">
                    {mockListing.title}
                  </h1>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-[#0d7a5f]">
                      от {mockListing.price} руб.
                    </div>
                    <div className="text-xs text-gray-400">за {mockListing.priceUnit}</div>
                  </div>
                </div>

                {/* Бейджи */}
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {mockListing.subcategory}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <MapPin className="h-3 w-3" />
                    {mockListing.city}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    isCompany ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {isCompany ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {isCompany ? 'Компания' : 'Частный специалист'}
                  </span>
                </div>

                {/* Галерея */}
                <ServiceGallery images={mockListing.images} title={mockListing.title} />

                {/* Описание */}
                <div className="mt-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">Описание услуги</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{mockListing.description}</p>
                </div>

                {/* Детали */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3">Детали</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Стоимость</p>
                      <p className="text-sm font-medium text-gray-900">от {mockListing.price} руб./{mockListing.priceUnit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Город</p>
                      <p className="text-sm font-medium text-gray-900">{mockListing.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Опыт работы</p>
                      <p className="text-sm font-medium text-gray-900">{mockListing.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Выезд на дом</p>
                      <p className="text-sm font-medium text-gray-900">{mockListing.homeVisit ? 'Да' : 'Нет'}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Другие объявления исполнителя */}
            {mockListing.otherListings.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">
                  Другие объявления этого исполнителя
                </h2>
                <div className="flex flex-col gap-2">
                  {mockListing.otherListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/services/listing/${listing.id}`}
                      className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:border-[#0d7a5f] hover:text-[#0d7a5f] transition-all group"
                    >
                      <span className="text-sm text-gray-700 group-hover:text-[#0d7a5f] transition-colors">
                        {listing.title}
                      </span>
                      <span className="text-sm font-medium text-[#0d7a5f] flex-shrink-0 ml-4">
                        от {listing.price} руб.
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Отзывы */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Отзывы ({mockListing.reviews.length})
              </h2>
              <div className="flex flex-col divide-y divide-gray-100">
                {mockListing.reviews.map((review) => (
                  <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#9B8CB4]/15 flex items-center justify-center text-xs font-semibold text-[#9B8CB4] flex-shrink-0">
                          {review.author.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            // biome-ignore lint/suspicious/noArrayIndexKey: static stars
                            key={i}
                            className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Сайдбар — исполнитель */}
          <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0 sticky top-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">

              {/* Аватар + имя */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                  isCompany ? 'bg-blue-100 text-blue-600' : 'bg-[#0d7a5f]/10 text-[#0d7a5f]'
                }`}>
                  {executor.initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{executor.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isCompany ? 'Компания' : 'Частный специалист'}
                  </p>
                </div>
              </div>

              {/* Рейтинг */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      // biome-ignore lint/suspicious/noArrayIndexKey: static stars
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{executor.rating}</span>
                <span className="text-xs text-gray-400">({executor.reviewsCount})</span>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{executor.reviewsCount}</p>
                  <p className="text-xs text-gray-400">Отзывов</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{executor.listingsCount}</p>
                  <p className="text-xs text-gray-400">Объявлений</p>
                </div>
              </div>

              {/* Кнопки */}
              <Button className="w-full bg-[#0d7a5f] hover:bg-[#0a6149] text-white mb-2">
                Написать / Позвонить
              </Button>
              <Button variant="outline" asChild className="w-full border-[#0d7a5f] text-[#0d7a5f] hover:bg-[#0d7a5f]/5">
                <Link href={`/profile/${executor.name}`}>Перейти в профиль</Link>
              </Button>

              <div className="border-t border-gray-100 mt-4 pt-4">
                {executor.verified && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Shield className="h-4 w-4 text-[#0d7a5f] flex-shrink-0" />
                    <span>Профиль подтверждён</span>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  На платформе с {executor.memberSince}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
