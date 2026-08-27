import { Briefcase, UserSearch } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

export function CtaSection({ isAuthenticated }: CtaSectionProps) {
  return (
    <section className="py-20 bg-muted">
      <PageContainer>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Для клиентов */}
          <div className="p-12 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden group">
            <div className="absolute top-8 right-8 xl:top-8 xl:right-8 opacity-10 group-hover:scale-125 transition-transform duration-500 hidden sm:block md:hidden xl:block">
              <UserSearch className="h-32 w-32 xl:h-32 xl:w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-primary-foreground">
                Нужен специалист?
              </h3>
              <p className="text-base mb-8 opacity-90 max-w-sm leading-relaxed">
                Найдите профессионала для вашей задачи бесплатно и без посредников прямо сейчас.
              </p>
              <Link
                href="/services"
                className="inline-block bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all active:scale-95"
              >
                Найти специалиста
              </Link>
            </div>
          </div>

          {/* Для исполнителей */}
          <div className="p-12 rounded-3xl bg-white border-2 border-secondary relative overflow-hidden group">
            <div className="absolute top-8 right-8 xl:top-8 xl:right-8 opacity-5 text-secondary group-hover:scale-125 transition-transform duration-500 hidden sm:block md:hidden xl:block">
              <Briefcase className="h-32 w-32 xl:h-32 xl:w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-secondary">
                Принимаете заказы?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block border-2 border-secondary text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-secondary hover:text-white transition-all active:scale-95"
              >
                Разместить услугу
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
