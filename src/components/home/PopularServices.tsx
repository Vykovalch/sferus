import Link from 'next/link'
import { ArrowRight, Wrench, Zap, House, Paintbrush, Monitor } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const categories = [
  { name: 'Ремонт', icon: Wrench, slug: 'remont', count: '120+' },
  { name: 'Электрика', icon: Zap, slug: 'elektrika', count: '85+' },
  { name: 'Сантехника', icon: House, slug: 'santehnika', count: '95+' },
  { name: 'Покраска', icon: Paintbrush, slug: 'pokraska', count: '60+' },
  { name: 'IT услуги', icon: Monitor, slug: 'it', count: '45+' },
]

export function PopularServices() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center text-foreground mb-12">
          Популярные услуги
        </h2>        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link key={cat.name} href={`/services?category=${cat.slug}`} className="h-full">
                <Card className="cursor-pointer bg-card text-card-foreground h-full group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-shadow duration-300">
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                    
                    <div className="p-3 bg-brand/5 rounded-2xl text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-all duration-300 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-sm font-semibold mb-1.5 text-foreground group-hover:text-brand transition-colors duration-300">
                      {cat.name}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground font-normal">
                      <span className="font-medium text-foreground/80 group-hover:text-brand transition-colors duration-300">
                        {cat.count}
                      </span>{' '}
                      объявлений
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}

          <Link href="/services" className="h-full">
            <Card className="cursor-pointer bg-card text-card-foreground h-full group relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <CardContent className="p-6 text-center relative z-10 flex flex-col items-center justify-center h-full">
                <div className="p-3 bg-brand/5 rounded-2xl text-brand group-hover:bg-brand group-hover:text-brand-foreground transition-all duration-300 mb-4">
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors duration-300">
                  Смотреть все
                </h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}
