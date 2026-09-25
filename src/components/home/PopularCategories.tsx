import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { getCategories } from "@/features/categories/queries";
import { getServiceCountsByCategory } from "@/features/services/queries";

/**
 * Сколько категорий показываем на главной. Совпадает с числом колонок сетки
 * на широком экране (`xl:grid-cols-5`), чтобы блок занимал ровно один ряд
 * и последняя карточка не висела одна во втором.
 */
const POPULAR_COUNT = 5;

/**
 * Популярные категории — те, в которых реально есть объявления, по убыванию их
 * числа. Пока объявлений нет, вместо карточек выводится сообщение: показывать
 * произвольные категории и называть их популярными — та же выдумка, что и моки.
 *
 * Карточки появятся сами, как только опубликуют первую услугу.
 */
export async function PopularCategories() {
  const [categories, counts] = await Promise.all([getCategories(), getServiceCountsByCategory()]);

  const popular = categories
    .map((category) => ({ ...category, count: counts.get(category.id) ?? 0 }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, POPULAR_COUNT);

  return (
    <section className="py-16 bg-background">
      <PageContainer>
        {/* Заголовок и ссылка переносятся целой строкой, а не сжимаются
            (решение владельца, 2026-09-25). Без `flex-wrap` на телефоне
            им вдвоём не хватало ширины — при 393px контейнер 361px, а нужно
            около 430, — и флексбокс сжимал обоих: заголовок ломался
            на «Популярные / категории», ссылка на «Все / категории», а шеврон
            повисал по центру между её строками.

            Заголовок сам по себе умещается в строку (около 290px); ломала его
            соседка. Поэтому именно перенос строки, а не уменьшение кегля
            заголовка: кегль здесь общий для всех секций главной, и менять его
            ради одной — тянуть за собой остальные.

            `ml-auto` на ссылке: после переноса она остаётся у правого края,
            а не уходит влево под заголовок. Правый край строки заголовка —
            выученное место, где ищут «показать всё»; уводя ссылку влево,
            мы дали бы ей два разных места на разных ширинах, и под заголовком
            слева она читалась бы подзаголовком, а не действием.

            Замеры по скриншоту владельца (экран 393px, масштаб снимка 1.626):
            контейнер 361px, заголовок в строку 262px, ссылка с шевроном
            ~133px — не хватает 34px.

            Отклонённые варианты. **Сокращать подпись до «Все»** на узких
            экранах (так делают Ozon, Booking, Amazon): при 360px контейнер
            328px, а строке нужно ~322 — шесть пикселей запаса, то есть любое
            удлинение заголовка ломает всё обратно. **Оставлять один шеврон**
            без слов: помещается с запасом, но для площадки, к которой никто
            ещё не привык, это слабая подсказка. **Уменьшать кегль
            заголовка**: он общий для всех секций главной. */}
        <div className="flex flex-wrap items-end justify-between gap-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Популярные категории
          </h2>
          {/* Шеврон, а не текстовый символ «>»: у знака своя базовая линия
              и своя насечка, он не центруется по строке и озвучивается
              скринридером как «больше». Иконки в проекте — из lucide.

              Связка для ссылки «смотреть все»: шеврон стоит всегда,
              подчёркивание появляется только при наведении и фокусе.
              Подчёркивание в покое — идиома ссылки внутри текста, где её надо
              отличить от соседних слов; рядом с заголовком секции отличать
              не от чего, и линия остаётся просто линией.

              Правило DESIGN.md «у кнопок стрелок нет» сюда не относится:
              оно про кнопки, у которых есть заливка и рамка. У текстовой
              ссылки шеврон — единственный признак перехода помимо цвета. */}
          <Link
            href="/services"
            className="group ml-auto inline-flex items-center gap-1.5 text-base font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            Все категории
            <ChevronRight
              aria-hidden="true"
              className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </div>

        {popular.length === 0 ? (
          <p className="text-muted-foreground">Категорий с объявлениями пока нет</p>
        ) : (
          // Сетка совпадает со страницей всех категорий (app/(main)/services/page.tsx):
          // карточки одной ширины и с одинаковыми зазорами в обоих местах
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {popular.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                count={category.count}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}
