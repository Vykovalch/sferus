import Link from 'next/link'
import { MapPin, Star, Building2, User } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ServiceCardProps {
  service: {
    id: number
    title: string
    subcategory: string
    executor: {
      name: string
      initials: string
      type: 'individual' | 'company'
      rating: number
      reviewsCount: number
    }
    city: string
    price: number
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isCompany = service.executor.type === 'company'

  return (
    <Link href={`/services/listing/${service.id}`}>
      <Card className="h-full border border-gray-200 hover:border-[#0d7a5f] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden">

        {/* Изображение */}
        <div className="h-36 bg-gradient-to-br from-[#0d7a5f]/6 to-[#0d7a5f]/3 flex items-center justify-center relative">
          <span className="text-5xl font-bold text-[#0d7a5f]/15 select-none">
            {service.title.charAt(0)}
          </span>
          {/* Бейдж подкатегории */}
          <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm text-[#0d7a5f] text-xs font-medium rounded-md border border-[#0d7a5f]/20">
            {service.subcategory}
          </span>
          {/* Бейдж типа исполнителя */}
          <span className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border ${
            isCompany
              ? 'bg-blue-50/90 text-blue-600 border-blue-200'
              : 'bg-white/90 text-gray-600 border-gray-200'
          }`}>
            {isCompany
              ? <Building2 className="h-3 w-3" />
              : <User className="h-3 w-3" />
            }
            {isCompany ? 'Компания' : 'Специалист'}
          </span>
        </div>

        <div className="p-4">
          {/* Название */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-3 group-hover:text-[#0d7a5f] transition-colors leading-snug">
            {service.title}
          </h3>

          {/* Исполнитель */}
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
              isCompany
                ? 'bg-blue-100 text-blue-600'
                : 'bg-[#0d7a5f]/10 text-[#0d7a5f]'
            }`}>
              {service.executor.initials}
            </div>
            <span className="text-sm text-gray-600 truncate">{service.executor.name}</span>
          </div>

          {/* Мета */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{service.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-700">{service.executor.rating}</span>
              <span>({service.executor.reviewsCount})</span>
            </div>
          </div>

          {/* Цена */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-base font-semibold text-[#0d7a5f]">
              от {service.price} руб.
            </p>
            <span className="text-xs text-[#0d7a5f] font-medium group-hover:underline">
              Подробнее →
            </span>
          </div>
        </div>

      </Card>
    </Link>
  )
}
