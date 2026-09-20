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
        {/* Заголовок секции есть только для скринридера: визуально его роль
            играют два заголовка карточек, но без него структура страницы
            прыгала с h2 предыдущей секции сразу на h3. */}
        <h2 className="sr-only">С чего начать</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Для клиентов */}
          {/* p-6 до 640px: при 48px со всех сторон на 375px содержимому
              оставалось 247px, и подпись кнопки переносилась на две строки
              внутри пилюли. Фон — токен `bg-card`, а не литерал `bg-white`:
              литерал остался бы белым в тёмной теме. */}
          <div className="p-6 sm:p-8 md:p-12 rounded-2xl bg-card border-2 border-primary relative overflow-hidden">
            {/* Водяной знак: без отклика на наведение. Увеличение по ховеру
                карточки обещало нажатие там, где его нет — нажимается кнопка
                внутри, а не карточка. */}
            <div className="absolute top-8 right-8 opacity-5 text-primary hidden sm:block md:hidden xl:block">
              <UserSearch className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-primary">
                Нужна услуга?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block border-2 border-primary text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-brand-fill hover:border-brand-fill hover:text-brand-fill-foreground transition-all active:scale-95"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Для исполнителей */}
          <div className="p-6 sm:p-8 md:p-12 rounded-2xl bg-card border-2 border-secondary relative overflow-hidden">
            <div className="absolute top-8 right-8 opacity-5 text-secondary hidden sm:block md:hidden xl:block">
              <Briefcase className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-secondary">
                Принимаете заказы?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block border-2 border-secondary text-secondary px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all active:scale-95"
              >
                Создать услугу
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
