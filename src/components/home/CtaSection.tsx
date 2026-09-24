import { Briefcase, UserSearch } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/PageContainer";

interface CtaSectionProps {
  isAuthenticated: boolean;
}

/**
 * Блок призыва в конце главной.
 *
 * **Полоса из двух половин, а не две карточки** (решение владельца, 2026-09-24).
 * До этого здесь стояли две белые карточки с рамками 2px и контурными кнопками
 * на светло-сером фоне: три почти белых тона подряд, цвет только в тонких
 * линиях, а последний призыв страницы был оформлен слабее, чем «Найти»
 * на первом экране.
 *
 * Половины окрашены в цвета знака: жёлтая — сторона клиентов, тёмная —
 * исполнителей. Это не украшение, а тот же код сторон площадки, что в меню
 * «Разместить» и в «Как это работает» (DESIGN.md, «Деление клиент / исполнитель»).
 * Кнопка каждой половины набрана цветом соседней — половины перекликаются,
 * как две части знака.
 *
 * **Скруглённый блок внутри светлой секции, а не полоса во всю ширину:**
 * иначе тёмная половина упиралась бы в тёмный подвал и они слились бы.
 *
 * Контраст: тёмный текст на жёлтом 11.0:1, приглушённый 6.8:1, белый на тёмном
 * 10.9:1, светло-серый 7.3:1; кнопки 17.0:1 и 11.0:1.
 */
export function CtaSection({ isAuthenticated }: CtaSectionProps) {
  return (
    <section className="py-20 bg-muted">
      <PageContainer>
        {/* Заголовок секции есть только для скринридера: визуально его роль
            играют два заголовка половин, но без него структура страницы
            прыгала с h2 предыдущей секции сразу на h3. */}
        <h2 className="sr-only">С чего начать</h2>

        <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden">
          {/* Клиентам: жёлтое поле, тёмная кнопка */}
          <div className="relative overflow-hidden bg-brand-fill p-6 sm:p-8 md:p-12">
            {/* Водяной знак: без отклика на наведение. Увеличение по ховеру
                обещало бы нажатие там, где его нет — нажимается кнопка внутри,
                а не половина. 12% вместо прежних 5%: на 5% рисунка не было
                видно вовсе. */}
            <div className="absolute -right-6 -bottom-8 text-foreground/12 hidden sm:block">
              <UserSearch className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                Нужна услуга?
              </h3>
              {/* Приглушение — прозрачностью тёмного, а не серым токеном:
                  на цветном поле холодный серый спорит с жёлтым. */}
              <p className="text-base text-foreground/80 mb-8 max-w-sm leading-relaxed">
                Изучите каталог категорий и найдите специалиста под любую задачу.
              </p>
              <Link
                href="/services"
                className="inline-block rounded-full bg-foreground px-6 py-3 sm:px-8 sm:py-4 font-semibold text-background transition-all hover:bg-foreground/90 active:scale-95"
              >
                Смотреть все категории
              </Link>
            </div>
          </div>

          {/* Исполнителям: тёмное поле, жёлтая кнопка. Поверхность — та же,
              что у подвала (`--footer-bg`), нового тёмного оттенка не заводим. */}
          <div className="relative overflow-hidden bg-footer-bg p-6 sm:p-8 md:p-12">
            <div className="absolute -right-6 -bottom-8 text-white/12 hidden sm:block">
              <Briefcase className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white">
                Принимаете заказы?
              </h3>
              <p className="text-base text-neutral-300 mb-8 max-w-sm leading-relaxed">
                Разместите услугу бесплатно — без комиссий и предоплаты. Получайте заказы напрямую.
              </p>
              <Link
                href={isAuthenticated ? "/services/new" : "/register"}
                className="inline-block rounded-full bg-brand-fill px-6 py-3 sm:px-8 sm:py-4 font-semibold text-brand-fill-foreground transition-all hover:bg-brand-fill/90 active:scale-95"
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
