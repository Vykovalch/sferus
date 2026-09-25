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
        <div className="flex items-end justify-between mb-12">
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
            className="group inline-flex items-center gap-1.5 text-base font-medium text-primary hover:underline underline-offset-4 transition-colors"
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
