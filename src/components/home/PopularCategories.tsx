import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { getCategories } from "@/features/categories/queries";
import { getServiceCountsByCategory } from "@/features/services/queries";
import { categoryIcon, categoryStyle } from "@/lib/constants";

/** Сколько категорий показываем на главной. */
const POPULAR_COUNT = 6;

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Популярные категории
            </h2>
            <div className="w-20 h-1.5 bg-primary mt-2 rounded-full" />
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:underline underline-offset-4 transition-colors"
          >
            Все категории
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {popular.length === 0 ? (
          <p className="text-muted-foreground">Категорий с объявлениями пока нет</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popular.map((category) => {
              const style = categoryStyle(category.slug);
              return (
                <CategoryCard
                  key={category.slug}
                  name={category.name}
                  slug={category.slug}
                  icon={categoryIcon(category.icon)}
                  count={category.count}
                  iconColor={style.icon}
                  iconBg={style.bg}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
