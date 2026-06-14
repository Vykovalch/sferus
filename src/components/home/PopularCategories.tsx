import { ArrowRight, Hammer, Wrench, Home, Car, Monitor, Truck } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/shared/CategoryCard";

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
  {
      name: "Транспорт и доставка",
      slug: "transport-i-dostavka",
      icon: Truck,
      count: 44,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-600/10",
    },
];

export function PopularCategories() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight">
            Популярные категории
          </h2>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline underline-offset-4 transition-colors"
          >
            Все категории
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
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
        </div>
      </div>
    </section>
  );
}
