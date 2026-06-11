"use client";

import { Search, MapPin, ChevronDown } from "lucide-react";
import {
  Hammer,
  Wrench,
  Home,
  Car,
  Monitor,
  Scale,
  Briefcase,
  Camera,
  PartyPopper,
  UtensilsCrossed,
  Stethoscope,
  Heart,
  GraduationCap,
  PawPrint,
  Building,
  Truck,
  Shield,
  Factory,
  Sprout,
  Flower,
} from "lucide-react";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  {
    name: "Строительство и ремонт",
    slug: "stroitelstvo-i-remont",
    icon: Hammer,
    count: 120,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    name: "Ремонт техники и оборудования",
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
    name: "Юридические услуги и документы",
    slug: "yuridicheskie-i-dokumenty",
    icon: Scale,
    count: 38,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-500/10",
  },
  {
    name: "Бизнес и финансы",
    slug: "biznes-i-finansy",
    icon: Briefcase,
    count: 42,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-600/10",
  },
  {
    name: "Фото и видео",
    slug: "foto-i-video",
    icon: Camera,
    count: 33,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    name: "Мероприятия и праздники",
    slug: "meropriyatiya-i-prazdniki",
    icon: PartyPopper,
    count: 25,
    iconColor: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
  },
  {
    name: "Еда и кейтеринг",
    slug: "eda-i-kejtering",
    icon: UtensilsCrossed,
    count: 18,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    name: "Медицина",
    slug: "medicina",
    icon: Stethoscope,
    count: 29,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    name: "Красота, здоровье и фитнес",
    slug: "krasota-zdorove-fitnes",
    icon: Heart,
    count: 67,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-500/10",
  },
  {
    name: "Образование и обучение",
    slug: "obrazovanie-i-obuchenie",
    icon: GraduationCap,
    count: 54,
    iconColor: "text-cyan-500",
    iconBg: "bg-cyan-500/10",
  },
  {
    name: "Домашние животные",
    slug: "domashnie-zhivotnye",
    icon: PawPrint,
    count: 22,
    iconColor: "text-lime-600",
    iconBg: "bg-lime-600/10",
  },
  {
    name: "Недвижимость и риелторы",
    slug: "nedvizhimost-i-rieltor",
    icon: Building,
    count: 31,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-600/10",
  },
  {
    name: "Транспорт и доставка",
    slug: "transport-i-dostavka",
    icon: Truck,
    count: 44,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-600/10",
  },
  {
    name: "Охрана и безопасность",
    slug: "ohrana-i-bezopasnost",
    icon: Shield,
    count: 15,
    iconColor: "text-zinc-600",
    iconBg: "bg-zinc-600/10",
  },
  {
    name: "Производство и изготовление",
    slug: "proizvodstvo-i-izgotovlenie",
    icon: Factory,
    count: 27,
    iconColor: "text-stone-500",
    iconBg: "bg-stone-500/10",
  },
  {
    name: "Агро и благоустройство",
    slug: "agro-i-blagoustrojstvo",
    icon: Sprout,
    count: 19,
    iconColor: "text-green-600",
    iconBg: "bg-green-600/10",
  },
  {
    name: "Ритуальные услуги",
    slug: "ritualnye-usligi",
    icon: Flower,
    count: 11,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-400/10",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero-блок с поисковой строкой */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Каталог услуг</h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl">
            Найдите специалиста среди 400+ проверенных исполнителей в Приднестровье
          </p>

          {/* Поисковая панель */}
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl w-full">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Поиск услуг и специалистов..."
                className="pl-10 h-11 border-input focus-visible:ring-brand placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 h-11 px-4 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer transition-colors justify-between md:justify-center"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground/60" />
                <span>Тирасполь</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/60" />
            </Button>

            <Button
              type="button"
              className="h-11 px-8 bg-brand hover:bg-brand/90 text-brand-foreground shadow font-medium cursor-pointer transition-colors"
            >
              Найти
            </Button>
          </div>

          {/* Статистика */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-6 border-t border-border/60 text-xs font-medium text-muted-foreground">
            <span>
              <span className="text-foreground font-semibold">500+</span> объявлений
            </span>
            <span>
              <span className="text-foreground font-semibold">400+</span> исполнителей
            </span>
            <span>
              <span className="text-foreground font-semibold">20</span> категорий
            </span>
            <span>
              <span className="text-foreground font-semibold">5</span> городов
            </span>
          </div>
        </div>
      </div>

      {/* Сетка категорий */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-lg font-medium tracking-tight mb-6">Все категории</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
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
    </div>
  );
}
