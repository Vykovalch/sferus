import { ArrowRight, Hammer, Wrench, Home, Car, Monitor } from "lucide-react";
import { CategoryCard } from "@/components/services/CategoryCard";

const popularCategories = [
  {
    name: "Строительство и ремонт",
    slug: "stroitelstvo-i-remont",
    icon: Hammer,
    count: 120,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    name: "Ремонт техники",
    slug: "remont-tehniki",
    icon: Wrench,
    count: 85,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
  },
  {
    name: "Дом, быт и уход",
    slug: "dom-byt-i-uhod",
    icon: Home,
    count: 95,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-500/10",
  },
  {
    name: "Автоуслуги",
    slug: "avtousligi",
    icon: Car,
    count: 60,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    name: "IT и Digital",
    slug: "it-i-digital",
    icon: Monitor,
    count: 45,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
  },
];

export function PopularServices() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-12">
          Популярные услуги
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {popularCategories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              icon={cat.icon}
              count={cat.count}
              iconColor={cat.iconColor}
              iconBg={cat.iconBg}
            />
          ))}

          <CategoryCard
            name="Смотреть все"
            slug=""
            icon={ArrowRight}
            count={0}
            countLabel="20 категорий"
            iconColor="text-brand"
            iconBg="bg-brand/10"
            iconHoverClass="group-hover:translate-x-1"
          />
        </div>
      </div>
    </section>
  );
}
