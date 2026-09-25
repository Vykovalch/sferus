import Link from "next/link";
import { LogoMark } from "@/components/shared/LogoMark";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

/**
 * Блок призыва в конце главной: две карточки с диагональной заливкой.
 * Композиция и направление градиента — с образца владельца (2026-09-24);
 * водяные знаки заменены на фирменный знак S 2026-09-25.
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
 * **Кнопки контурные, заливаются под курсором** (решение владельца,
 * 2026-09-25). В покое заливки нет вовсе — сквозь кнопку виден градиент
 * карточки, поэтому она совпадает с фоном в любой точке, чего сплошной цвет
 * не дал бы. При наведении появляется заливка: у клиентов фирменный жёлтый
 * `--brand-fill`, у исполнителей светлый серый `--cta-performer-paper`.
 *
 * **Рамка — в цвет текста своей карточки**: чернила на жёлтой, белая на серой.
 * Тем же цветом набрана подпись кнопки в покое. Цвет приходит изнутри пары,
 * а не со стороны — тот же закон, по которому здесь запрещён серый текст.
 *
 * Белую рамку на жёлтой карточке пробовали в тот же день и вернули чернильную:
 * белое на светлом золоте даёт 2.4:1, и у контурной кнопки не оставалось
 * ни одной границы при норме 3:1. Светлая рамка и читаемая кнопка на этой
 * карточке несовместимы — дело в светлоте заливки, а не в подборе оттенка.
 *
 * Все четыре состояния берут норму: жёлтая 6.1:1 по рамке в покое и при
 * наведении; серая 5.3:1 по рамке и 3.8:1 по заливке. Подписи 6.1:1 и 9.5:1
 * на жёлтой, 5.3:1 и 12.1:1 на серой.
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
            {/* Водяной знак — фирменный знак S (решение владельца, 2026-09-25;
                до этого здесь были лупа и портфель с его же образца).

                Высота 130% от карточки, сдвиг за правый край: знак срезается
                границей карточки и читается как графика, а не как потерявшаяся
                иконка. Прежние 80px тонким контуром при 10% выглядели именно
                так — оттого владелец и попросил «повыразительнее».

                Одноцветный: на цветной заливке жёлтая часть знака либо
                исчезает, либо спорит с фоном. Геометрия не меняется — это
                закреплённое обязательство бренда (PRODUCT.md).

                Ниже 640px знак скрыт: там карточка узкая, и он лез бы
                под текст. Отклика на наведение нет — нажимается кнопка
                внутри, а не карточка. */}
            <LogoMark
              decorative
              className="pointer-events-none absolute -right-12 top-1/2 hidden h-[130%] -translate-y-1/2 text-cta-client-ink/10 sm:block"
            />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-cta-client-ink">
                Нужна услуга?
              </h3>
              <p className="text-base text-cta-client-ink mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full border border-cta-client-ink bg-transparent px-6 py-3 sm:px-8 sm:py-4 font-semibold text-cta-client-ink transition-[background-color,transform] duration-200 ease-out hover:bg-brand-fill active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta-client-ink"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: холодная сторона */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cta-performer-from to-cta-performer-to p-6 sm:p-8 md:p-12 selection:bg-white selection:text-foreground">
            <LogoMark
              decorative
              className="pointer-events-none absolute -right-12 top-1/2 hidden h-[130%] -translate-y-1/2 text-white/10 sm:block"
            />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-white">
                Принимаете заказы?
              </h3>
              <p className="text-base text-white mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block rounded-full border border-white bg-transparent px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition-[background-color,color,transform] duration-200 ease-out hover:bg-cta-performer-paper hover:text-foreground active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
