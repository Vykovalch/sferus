import { Search, MapPin, ChevronDown } from 'lucide-react'
import {
  Hammer, Wrench, Home, Car, Monitor, Scale, Briefcase,
  Camera, PartyPopper, UtensilsCrossed, Stethoscope, Heart,
  GraduationCap, PawPrint, Building, Truck, Shield, Factory,
  Sprout, Flower,
} from 'lucide-react'
import { CategoryCard } from '@/components/services/CategoryCard'

const categories = [
  { name: 'Строительство и ремонт', slug: 'stroitelstvo-i-remont', icon: Hammer, count: 120 },
  { name: 'Ремонт техники и оборудования', slug: 'remont-tehniki', icon: Wrench, count: 85 },
  { name: 'Дом, быт и уход', slug: 'dom-byt-i-uhod', icon: Home, count: 95 },
  { name: 'Автоуслуги', slug: 'avtousligi', icon: Car, count: 60 },
  { name: 'IT и Digital', slug: 'it-i-digital', icon: Monitor, count: 45 },
  { name: 'Юридические услуги и документы', slug: 'yuridicheskie-i-dokumenty', icon: Scale, count: 38 },
  { name: 'Бизнес и финансы', slug: 'biznes-i-finansy', icon: Briefcase, count: 42 },
  { name: 'Фото и видео', slug: 'foto-i-video', icon: Camera, count: 33 },
  { name: 'Мероприятия и праздники', slug: 'meropriyatiya-i-prazdniki', icon: PartyPopper, count: 25 },
  { name: 'Еда и кейтеринг', slug: 'eda-i-kejtering', icon: UtensilsCrossed, count: 18 },
  { name: 'Медицина', slug: 'medicina', icon: Stethoscope, count: 29 },
  { name: 'Красота, здоровье и фитнес', slug: 'krasota-zdorove-fitnes', icon: Heart, count: 67 },
  { name: 'Образование и обучение', slug: 'obrazovanie-i-obuchenie', icon: GraduationCap, count: 54 },
  { name: 'Домашние животные', slug: 'domashnie-zhivotnye', icon: PawPrint, count: 22 },
  { name: 'Недвижимость и риелторы', slug: 'nedvizhimost-i-rieltor', icon: Building, count: 31 },
  { name: 'Транспорт и доставка', slug: 'transport-i-dostavka', icon: Truck, count: 44 },
  { name: 'Охрана и безопасность', slug: 'ohrana-i-bezopasnost', icon: Shield, count: 15 },
  { name: 'Производство и изготовление', slug: 'proizvodstvo-i-izgotovlenie', icon: Factory, count: 27 },
  { name: 'Агро и благоустройство', slug: 'agro-i-blagoustrojstvo', icon: Sprout, count: 19 },
  { name: 'Ритуальные услуги', slug: 'ritualnye-usligi', icon: Flower, count: 11 },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero поиск */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-2">Каталог услуг</h1>
          <p className="text-gray-500 mb-6">
            Найдите специалиста среди 400+ исполнителей в Приднестровье
          </p>
          <div className="flex gap-3 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск услуг и специалистов..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-[#0d7a5f] focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-[#0d7a5f] transition-colors"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>Тирасполь</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-[#0d7a5f] hover:bg-[#0a6149] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Найти
            </button>
          </div>

          {/* Статистика */}
          <div className="flex gap-6 mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
            <span><span className="font-semibold text-gray-900">500+</span> объявлений</span>
            <span><span className="font-semibold text-gray-900">400+</span> исполнителей</span>
            <span><span className="font-semibold text-gray-900">20</span> категорий</span>
            <span><span className="font-semibold text-gray-900">5</span> городов</span>
          </div>
        </div>
      </div>

      {/* Сетка категорий */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Все категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              count={cat.count}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
