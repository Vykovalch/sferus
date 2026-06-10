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
    <section className="py-20">
      <div className="container mx-auto px-4">
        
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-12">
          Топ объявления
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto">
          {listings.map((listing: Listing) => {
            const Icon = listing.icon
            return (
              <Link key={listing.id} href={`/services/${listing.id}`}>
                {/* Карточка переведена на переменные Shadcn и плавную анимацию бренда */}
                <Card className="cursor-pointer bg-card text-card-foreground border border-border hover:shadow-xl hover:border-brand hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                  <div className="flex p-3 gap-4">
                    
                    {/* Контейнер изображения или заглушки */}
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-brand/5">
                      {listing.image ? (
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand">
                          {Icon && <Icon className="h-10 w-10 stroke-[1.5]" />}
                        </div>
                      )}
                    </div>

                    {/* Текстовый контент */}
                    <div className="flex-1 flex flex-col py-0.5">
                      {/* Мягкий бейдж категории */}
                      <span className="inline-block w-fit px-2.5 py-0.5 bg-brand/10 text-brand text-xs font-semibold rounded-md mb-2">
                        {listing.category}
                      </span>
                      
                      {/* Название услуги с подсветкой при наведении */}
                      <h3 className="font-semibold text-base text-foreground line-clamp-1 mb-2 group-hover:text-brand transition-colors duration-300">
                        {listing.title}
                      </h3>
                      
                      <div className="mt-auto space-y-2.5">
                        {/* Локация и автор */}
                        <div className="space-y-1 text-xs text-muted-foreground font-normal">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 opacity-70" />
                            <span>{listing.author}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 opacity-70" />
                            <span>{listing.city}</span>
                          </div>
                        </div>
                        
                        {/* Нижняя планка: Рейтинг и Цена */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-sm text-foreground/90">{listing.rating}</span>
                            <span className="text-xs text-muted-foreground">({listing.reviewsCount})</span>
                          </div>
                          {/* Цена подсвечена цветом бренда */}
                          <p className="text-base font-bold text-brand">{listing.price}</p>
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
