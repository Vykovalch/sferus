import { Briefcase, UserSearch } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

/**
 * Блок призыва в конце главной: две карточки с мягкой заливкой и залитыми
 * кнопками (образец владельца, 2026-09-24).
 *
 * История за один день. Сначала здесь были белые карточки с рамками 2px
 * и контурными кнопками: три почти белых тона подряд, цвет только в линиях,
 * а последний призыв страницы оформлен слабее, чем «Найти» на первом экране.
 * Затем пробовали сплошную полосу из жёлтой и тёмной половин — владелец
 * заменил её на этот вариант: карточки остаются раздельными, цвет приходит
 * заливкой, а силу даёт кнопка.
 *
 * Стороны площадки по-прежнему различаются (DESIGN.md, «Деление клиент /
 * исполнитель»): у клиентов тёплая жёлтая сторона, у исполнителей холодная
 * серая.
 *
 * Контраст: заголовок `--brand` на жёлтой заливке 4.4:1 — норма для крупного
 * текста 3:1; подписи 7.2:1; тёмный на жёлтой кнопке 11.0:1; белый на тёмной
 * кнопке 10.9:1.
 *
 * Стрелок в кнопках нет: правило DESIGN.md — кнопка заявляет о себе заливкой
 * и формой, стрелка внутри ничего не добавляет. В образце они были.
 */
export function CtaSection({ isAuthenticated }: CtaSectionProps) {
  return (
    <section className="py-20 bg-muted">
      <PageContainer>
        {/* Заголовок секции есть только для скринридера: визуально его роль
            играют два заголовка карточек, но без него структура страницы
            прыгала с h2 предыдущей секции сразу на h3. */}
        <h2 className="sr-only">С чего начать</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Клиентам: тёплая заливка, жёлтая кнопка */}
          <div className="relative overflow-hidden rounded-2xl border border-brand-fill/60 bg-brand-fill/10 p-6 sm:p-8 md:p-12">
            {/* Водяной знак: без отклика на наведение. Увеличение по ховеру
                обещало бы нажатие там, где его нет — нажимается кнопка внутри,
                а не карточка. 25% вместо прежних 5%: на пяти процентах рисунка
                не было видно вовсе. */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden text-brand-fill/25 sm:block">
              <UserSearch className="h-36 w-36" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-brand">
                Нужна услуга?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full bg-brand-fill px-6 py-3 sm:px-8 sm:py-4 font-semibold text-brand-fill-foreground transition-all hover:bg-brand-fill/90 active:scale-95"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: холодная сторона, тёмная кнопка (`--footer-bg` —
              та же тёмная поверхность, что у подвала). */}
          <div className="relative overflow-hidden rounded-2xl border border-secondary/30 bg-background p-6 sm:p-8 md:p-12">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden text-secondary/15 sm:block">
              <Briefcase className="h-36 w-36" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                Принимаете заказы?
              </h3>
              <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block rounded-full bg-footer-bg px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition-all hover:bg-footer-bg/90 active:scale-95"
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
