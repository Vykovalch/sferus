import { Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

/**
 * Блок призыва в конце главной: две карточки с диагональной заливкой и белым
 * текстом (образец владельца, 2026-09-24, второй за день).
 *
 * История одного дня. Сначала здесь были белые карточки с рамками 2px
 * и контурными кнопками: три почти белых тона подряд, цвет только в линиях,
 * а последний призыв страницы оформлен слабее, чем «Найти» на первом экране.
 * Потом пробовали сплошную полосу из жёлтой и тёмной половин. Потом —
 * разбавленную жёлтую заливку 10%. Теперь заливки плотные и с градиентом;
 * цвета и направление сняты пипеткой с образца владельца.
 *
 * Стороны площадки по-прежнему различаются (DESIGN.md, «Деление клиент /
 * исполнитель»): у клиентов тёплая оранжевая, у исполнителей холодная
 * серо-синяя. Поверхности заданы токенами `--cta-*` в globals.css.
 *
 * **Текст на карточках разного цвета, и это не оплошность.** На образце белый
 * был на обеих, но на оранжевой он даёт 2.1:1 при норме 4.5:1 — оранжевый
 * и белый слишком близки по светлоте. Цвета образца сохранены, поменян текст:
 * на оранжевой тёмный `--foreground` (5.8:1 в тёмном углу, 8.3:1 в светлом),
 * на серо-синей белый (4.2:1 в светлом углу — заголовок как крупный текст
 * проходит при норме 3:1; подписи стоят ниже, где 5.4:1). Правило площадки то же
 * самое: светлота заливки решает, какого цвета на ней текст (DESIGN.md,
 * «Контраст»).
 *
 * Кнопки по тому же правилу — каждая максимально контрастна своей заливке:
 * на оранжевой тёмная с белым текстом (край 7.0:1), на серо-синей белая
 * с тёмным (край 5.4:1). Прозрачную кнопку с образца пришлось оставить:
 * белый на белом 20% поверх оранжевого — 2.1:1, кнопка растворялась.
 * Белая кнопка на оранжевой тоже не годится: край 2.5:1 при норме 3:1.
 * Стрелок внутри нет — правило DESIGN.md, кнопка заявляет о себе заливкой
 * и формой.
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
          {/* Клиентам: тёплая сторона */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-client-from to-cta-client-to p-6 sm:p-8 md:p-12">
            {/* Водяной знак: без отклика на наведение. Увеличение по ховеру
                обещало бы нажатие там, где его нет — нажимается кнопка внутри,
                а не карточка. Угол верхний правый и размер 80px — с образца. */}
            <div className="pointer-events-none absolute right-6 top-6 hidden text-foreground/10 sm:block md:right-10 md:top-10">
              <Search aria-hidden="true" className="size-20" strokeWidth={1.5} />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                Нужна услуга?
              </h3>
              <p className="text-base text-foreground mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full bg-foreground px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition-colors hover:bg-foreground/90 active:scale-95"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: холодная сторона */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-performer-from to-cta-performer-to p-6 sm:p-8 md:p-12">
            <div className="pointer-events-none absolute right-6 top-6 hidden text-white/10 sm:block md:right-10 md:top-10">
              <Briefcase aria-hidden="true" className="size-20" strokeWidth={1.5} />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white">
                Принимаете заказы?
              </h3>
              <p className="text-base text-white mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block rounded-full bg-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-foreground transition-colors hover:bg-white/90 active:scale-95"
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
