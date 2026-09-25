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
 * Теней нет нигде (решения владельца, 2026-09-25). У карточек они добавляли
 * высоту, которой нет: нажимается кнопка внутри, а не карточка. У кнопок тень
 * ушла вместе с подъёмом при наведении — без тени подъём ничем не объяснён.
 *
 * Вместо тени у кнопок рамка 1px **в цвет собственной подписи**. Наведение
 * выворачивает кнопку наизнанку — заливка и подпись меняются местами, рамка
 * уходит в цвет прежней заливки.
 *
 * **Белого в кнопках нет** (решение владельца, 2026-09-25): каждая кнопка
 * набрана двумя цветами своей карточки. У клиентов это фирменный жёлтый
 * `--brand-fill` и чернила, у исполнителей — светлый серый
 * `--cta-performer-paper` и `--foreground`. Белая заливка на цветной
 * поверхности всегда приходит со стороны.
 *
 * Рамка — не украшение, а вторая граница: у жёлтой кнопки заливка к карточке
 * даёт 1.6:1, и норму 3:1 держит рамка (6.1:1); при наведении они меняются
 * ролями. У серой кнопки норму берут обе — 3.8:1 и 3.2:1. Подписи 9.5:1
 * и 12.1:1.
 *
 * Обводка кнопки при фокусе и выделение текста заданы явно — на цветной
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
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-client-from to-cta-client-to p-6 sm:p-8 md:p-12 selection:bg-cta-client-ink selection:text-cta-client-paper">
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
                className="inline-block rounded-full border border-cta-client-ink bg-brand-fill px-6 py-3 sm:px-8 sm:py-4 font-semibold text-cta-client-ink transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-brand-fill hover:bg-cta-client-ink hover:text-brand-fill active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-client-ink"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: холодная сторона */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-performer-from to-cta-performer-to p-6 sm:p-8 md:p-12 selection:bg-white selection:text-foreground">
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
                className="inline-block rounded-full border border-foreground bg-cta-performer-paper px-6 py-3 sm:px-8 sm:py-4 font-semibold text-foreground transition-[background-color,border-color,color,transform] duration-200 ease-out hover:border-cta-performer-paper hover:bg-foreground hover:text-cta-performer-paper active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-performer-paper"
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
