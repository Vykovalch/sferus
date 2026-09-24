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
 * исполнитель»): у клиентов тёплая жёлто-золотая, у исполнителей спокойная
 * серая. Поверхности заданы токенами `--cta-*` в globals.css; цвета сняты
 * с образца и подправлены владельцем 2026-09-24 — первая желтее, вторая серее.
 *
 * Текст белый на обеих карточках. Кнопки разные, так на образце: у клиентов
 * прозрачная `bg-white/20` с рамкой `border-white/45`, у исполнителей сплошная
 * белая с тёмным текстом. Стрелок внутри нет — правило DESIGN.md, кнопка
 * заявляет о себе заливкой и формой.
 *
 * **Белый текст на жёлтой карточке нормы контраста не набирает** — 2.0:1
 * в светлом углу и 2.9:1 в тёмном при норме 4.5:1. Разработчик предлагал
 * тёмный текст (5.9:1 … 8.4:1) и показал вид рядом с образцом; владелец
 * посмотрел и подтвердил свой макет — «сделай точно так, как на картинке»
 * (2026-09-24). Это его решение, принятое с числами на руках, а не недосмотр.
 * Записано в PROGRESS.md, «Известные проблемы», пункт 37, вместе со способами
 * закрыть, если владелец передумает.
 *
 * На серой карточке белый в порядке: 4.2:1 в светлом углу — заголовок там
 * крупный, норма 3:1, а подписи стоят ниже по градиенту, где 5.4:1.
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
            <div className="pointer-events-none absolute right-6 top-6 hidden text-white/10 sm:block md:right-10 md:top-10">
              <Search aria-hidden="true" className="size-20" strokeWidth={1.5} />
            </div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white">
                Нужна услуга?
              </h3>
              <p className="text-base text-white mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full border border-white/45 bg-white/20 px-6 py-3 sm:px-8 sm:py-4 font-semibold text-white transition-colors hover:bg-white/30 active:scale-95"
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
