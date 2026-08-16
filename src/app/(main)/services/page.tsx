import { CategoryCard } from "@/components/shared/CategoryCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { getCategories } from "@/features/categories/queries";
import { getCities } from "@/features/cities/queries";
import { getServiceCountsByCategory } from "@/features/services/queries";
import { categoryIcon, categoryStyle } from "@/lib/constants";

export default async function ServicesPage() {
  const [categories, cities, counts] = await Promise.all([
    getCategories(),
    getCities(),
    getServiceCountsByCategory(),
  ]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Услуги</h1>
        <div className="max-w-3xl mb-8">
          <SearchBar cities={cities} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const style = categoryStyle(cat.slug);
            return (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={categoryIcon(cat.icon)}
                count={counts.get(cat.id) ?? 0}
                iconColor={style.icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
