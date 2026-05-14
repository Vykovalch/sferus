import Link from 'next/link'
import Image from 'next/image'
import { MapPin, User, Star, Zap, House } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

type Listing = {
  id: string
  title: string
  category: string
  author: string
  city: string
  rating: number
  reviewsCount: number
  price: string
  image: string | null
  icon: LucideIcon | null
}

const listings: Listing[] = [
  {
    id: '1',
    title: 'Ремонт стиральных машин',
    category: 'Ремонт',
    author: 'Александр М.',
    city: 'Тирасполь',
    rating: 4.9,
    reviewsCount: 127,
    price: 'от 150 руб.',
    image: '/master1.jpg',
    icon: null,
  },
  {
    id: '2',
    title: 'Электромонтажные работы',
    category: 'Электрика',
    author: 'Виктор П.',
    city: 'Бендеры',
    rating: 5,
    reviewsCount: 89,
    price: 'от 80 руб.',
    image: null,
    icon: Zap,
  },
  {
    id: '3',
    title: 'Уборка квартир и офисов',
    category: 'Уборка',
    author: 'Екатерина Л.',
    city: 'Тирасполь',
    rating: 4.8,
    reviewsCount: 156,
    price: 'от 200 руб.',
    image: '/master2.jpg',
    icon: null,
  },
  {
    id: '4',
    title: 'Ремонт сантехники',
    category: 'Сантехника',
    author: 'Дмитрий К.',
    city: 'Рыбница',
    rating: 4.9,
    reviewsCount: 94,
    price: 'от 100 руб.',
    image: null,
    icon: House,
  },
]

export function TopListings() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Топ объявления
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {listings.map((listing) => {
            const Icon = listing.icon
            return (
              <Link key={listing.id} href={`/services/${listing.id}`}>
                <Card className="cursor-pointer border border-gray-300 hover:shadow-lg hover:border-[#0d7a5f] hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="flex p-3 gap-3">
                    {/* Изображение */}
                    <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-[#0d7a5f]/10">
                      {listing.image ? (
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {Icon && <Icon className="h-10 w-10 text-[#7EBFB3]" />}
                        </div>
                      )}
                    </div>

                    {/* Контент */}
                    <div className="flex-1 flex flex-col py-1">
                      <span className="inline-block w-fit px-2 py-0.5 bg-[#0d7a5f]/10 text-[#0d7a5f] text-xs font-medium rounded mb-2">
                        {listing.category}
                      </span>
                      <h3 className="font-semibold text-base line-clamp-1 mb-3">
                        {listing.title}
                      </h3>
                      <div className="mt-auto space-y-2">
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{listing.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{listing.city}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">{listing.rating}</span>
                            <span className="text-xs text-gray-400">({listing.reviewsCount})</span>
                          </div>
                          <p className="text-base font-bold text-[#0d7a5f]">{listing.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
