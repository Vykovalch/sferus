import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    // Используем muted/50 для красивого разделения с предыдущей белой секцией отзывов
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

          {/* Для клиентов */}
          <Card className="border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-3">
                Нужен специалист?
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-8 flex-grow">
                Найдите специалиста бесплатно и без посредников
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow group cursor-pointer"
              >
                <Link href="/services">
                  <span>Найти специалиста</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Для исполнителей */}
          <Card className="border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-3">
                Принимаете заказы?
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-8 flex-grow">
                Разместите услугу бесплатно — без комиссий и предоплаты
              </p>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full border-border text-foreground hover:bg-muted group cursor-pointer"
              >
                <Link href="/register">
                  <span>Разместить услугу</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
