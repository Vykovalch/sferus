import { Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

/**
 * Блок призыва в конце главной: две карточки с диагональной заливкой.
 * Композиция, направление градиента, размер и положение водяных знаков — с
 * образца владельца (2026-09-24).
 *
 * История одного дня. Белые карточки с рамками → сплошная полоса из жёлтой
 * и тёмной половин → разбавленная жёлтая заливка 10% → плотные градиенты
 * с образца → правка цветов (желтее и серее) → серый текст на жёлтой →
 * этот проход. Такой длины путь стоит помнить: следующий, кто захочет
 * «просто поменять цвет», меняет его шестой раз.
 *
 * **Чем этот проход отличается.** Серый текст на жёлтой заливке давал
 * 2.3-3.3:1 и читался как отключённая надпись. Заменён на чернила из того же
 * тона, что и заливка (`--cta-client-ink`, 71°): 5.1:1 на тёмном краю
 * и 7.0:1 на светлом. Правило общее и не только про цифры — на цветной
 * поверхности текст тонируется из её же тона; серый на цвете всегда выглядит
 * грязным, потому что не принадлежит ни поверхности, ни тексту.
 *
 * Стороны площадки различаются (DESIGN.md, «Деление клиент / исполнитель»):
 * у клиентов тёплая жёлто-золотая заливка, у исполнителей спокойная серая.
 * Поверхности заданы токенами `--cta-*` в globals.css.
 *
 * Кнопки — сплошные, каждая максимально контрастна своей заливке: на жёлтой
 * из чернил с тёплой белой подписью (край 6.5:1), на серой белая с тёмной
 * (край 4.9:1). Прозрачная кнопка с образца убрана: белая подпись на ней
 * давала 2.0:1, а серая — 3.4:1, и в обоих случаях главное действие страницы
 * выглядело слабее ссылки. Стрелок внутри нет — правило DESIGN.md.
 *
 * Тень у карточек тонирована каждая своим тоном, со смещением и размытием.
 * Обводка кнопки при фокусе и выделение текста тоже заданы — на цветной
 * заливке браузерные умолчания выпадают из палитры.
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
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-client-from to-cta-client-to p-6 sm:p-8 md:p-12 shadow-[0_18px_40px_-20px_rgba(74,44,0,0.55)] selection:bg-cta-client-ink selection:text-cta-client-paper">
            {/* Водяной знак: без отклика на наведение. Увеличение по ховеру
                обещало бы нажатие там, где его нет — нажимается кнопка внутри,
                а не карточка. Тонирован чернилами, а не белым: белый на жёлтом
                давал мутную дымку вместо рисунка. */}
            <div className="pointer-events-none absolute right-6 top-6 hidden text-cta-client-ink/10 sm:block md:right-10 md:top-10">
              <Search aria-hidden="true" className="size-20" strokeWidth={1.5} />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-cta-client-ink">
                Нужна услуга?
              </h3>
              <p className="text-base text-cta-client-ink mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full bg-cta-client-ink px-6 py-3 sm:px-8 sm:py-4 font-semibold text-cta-client-paper shadow-[0_8px_18px_-10px_rgba(40,24,0,0.9)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-12px_rgba(40,24,0,0.95)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-client-ink"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: холодная сторона */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-performer-from to-cta-performer-to p-6 sm:p-8 md:p-12 shadow-[0_18px_40px_-20px_rgba(30,40,46,0.5)] selection:bg-white selection:text-foreground">
            <div className="pointer-events-none absolute right-6 top-6 hidden text-white/10 sm:block md:right-10 md:top-10">
              <Briefcase aria-hidden="true" className="size-20" strokeWidth={1.5} />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-white">
                Принимаете заказы?
              </h3>
              <p className="text-base text-white mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block rounded-full bg-white px-6 py-3 sm:px-8 sm:py-4 font-semibold text-foreground shadow-[0_8px_18px_-10px_rgba(20,28,33,0.9)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_26px_-12px_rgba(20,28,33,0.95)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
