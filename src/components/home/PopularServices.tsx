import Link from 'next/link'
import { ArrowRight, Wrench, Zap, House, Paintbrush, Monitor } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { name: 'Ремонт', icon: Wrench, count: '120+', color: 'text-[#7EBFB3]', slug: 'remont' },
  { name: 'Электрика', icon: Zap, count: '85+', color: 'text-[#8BC68F]', slug: 'elektrika' },
  { name: 'Сантехника', icon: House, count: '95+', color: 'text-[#B4D167]', slug: 'santehnika' },
  { name: 'Покраска', icon: Paintbrush, count: '60+', color: 'text-[#9B8CB4]', slug: 'pokraska' },
  { name: 'IT услуги', icon: Monitor, count: '45+', color: 'text-[#5B8A94]', slug: 'it' },
]

export function PopularServices() {
  return (
    <section className="py-16 bg-[#0d7a5f]/4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
          Популярные услуги
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.name} href={`/services?category=${cat.slug}`}>
                <Card className="cursor-pointer border border-gray-300 h-full group hover:shadow-lg hover:border-[#0d7a5f] hover:-translate-y-0.5 transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <Icon
                      className={`h-12 w-12 mx-auto mb-3 ${cat.color} group-hover:text-[#0d7a5f] transition-all duration-200`}
                    />
                    <h3 className="text-sm font-semibold mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">{cat.count}</span> объявлений
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          {/* Смотреть все */}
          <Link href="/services">
            <Card className="cursor-pointer border border-dashed border-gray-300 bg-white h-full group relative overflow-hidden hover:shadow-lg hover:border-[#0d7a5f] hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <CardContent className="p-6 text-center relative z-10">
                <ArrowRight className="h-12 w-12 mx-auto mb-3 text-[#C8DC6C] group-hover:text-[#0d7a5f] transition-all duration-200" />
                <h3 className="text-sm font-semibold mb-1 text-gray-900">Смотреть все</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}
