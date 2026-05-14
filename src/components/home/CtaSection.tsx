import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-16 md:py-20 bg-[#0d7a5f]/4">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">

          {/* Для клиентов */}
          <Card className="border-2 hover:shadow-xl transition-all hover:border-[#0d7a5f] bg-white">
            <CardContent className="p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                Нужен специалист?
              </h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Найдите специалиста бесплатно и без посредников
              </p>
              <Button
                asChild
                className="w-full bg-[#0d7a5f] hover:bg-[#0a6149] text-white shadow-md group"
              >
                <Link href="/services">
                  Найти специалиста
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Для исполнителей */}
          <Card className="border-2 hover:shadow-xl transition-all hover:border-[#0d7a5f] bg-white">
            <CardContent className="p-8 md:p-10 flex flex-col h-full">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                Принимаете заказы?
              </h3>
              <p className="text-gray-600 mb-8 flex-grow">
                Разместите услугу бесплатно — без комиссий и предоплаты
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-2 border-[#0d7a5f] text-[#0d7a5f] hover:bg-[#0d7a5f] hover:text-white group"
              >
                <Link href="/register">
                  Разместить услугу
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
