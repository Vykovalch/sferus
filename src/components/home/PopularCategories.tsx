import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { getCategories } from "@/features/categories/queries";
import { categoryIcon, categoryStyle } from "@/lib/constants";

/** Сколько категорий показываем на главной. Порядок задаётся колонкой `order`. */
const POPULAR_COUNT = 6;

export async function PopularCategories() {
  const categories = (await getCategories()).slice(0, POPULAR_COUNT);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => {
            const style = categoryStyle(cat.slug);
            return (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={categoryIcon(cat.icon)}
                iconColor={style.icon}
                iconBg={style.bg}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
