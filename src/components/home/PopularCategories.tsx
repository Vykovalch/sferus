import { ArrowRight, Hammer, Wrench, Home, Car, Monitor, Truck } from "lucide-react";
import Link from "next/link";

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Заголовок с акцентной полоской */}
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

        {/* Сетка категорий */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="group p-6 rounded-2xl bg-muted/50 hover:bg-white hover:shadow-xl transition-all duration-200 border border-transparent hover:border-border flex flex-col items-center gap-4 text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cat.iconBg} group-hover:scale-110 transition-transform duration-200`}
              >
                <cat.icon className={`h-7 w-7 ${cat.iconColor}`} />
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground leading-snug">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{cat.count} объявлений</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
