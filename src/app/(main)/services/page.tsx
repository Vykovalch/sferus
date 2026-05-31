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
import { CategoryCard } from "@/components/services/CategoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Строительство и ремонт", slug: "stroitelstvo-i-remont", icon: Hammer, count: 120 },
  { name: "Ремонт техники и оборудования", slug: "remont-tehniki", icon: Wrench, count: 85 },
  { name: "Дом, быт и уход", slug: "dom-byt-i-uhod", icon: Home, count: 95 },
  { name: "Автоуслуги", slug: "avtousligi", icon: Car, count: 60 },
  { name: "IT и Digital", slug: "it-i-digital", icon: Monitor, count: 45 },
  {
    name: "Юридические услуги и документы",
    slug: "yuridicheskie-i-dokumenty",
    icon: Scale,
    count: 38,
  },
  { name: "Бизнес и финансы", slug: "biznes-i-finansy", icon: Briefcase, count: 42 },
  { name: "Фото и видео", slug: "foto-i-video", icon: Camera, count: 33 },
  {
    name: "Мероприятия и праздники",
    slug: "meropriyatiya-i-prazdniki",
    icon: PartyPopper,
    count: 25,
  },
  { name: "Еда и кейтеринг", slug: "eda-i-kejtering", icon: UtensilsCrossed, count: 18 },
  { name: "Медицина", slug: "medicina", icon: Stethoscope, count: 29 },
  { name: "Красота, здоровье и фитнес", slug: "krasota-zdorove-fitnes", icon: Heart, count: 67 },
  {
    name: "Образование и обучение",
    slug: "obrazovanie-i-obuchenie",
    icon: GraduationCap,
    count: 54,
  },
  { name: "Домашние животные", slug: "domashnie-zhivotnye", icon: PawPrint, count: 22 },
  { name: "Недвижимость и риелторы", slug: "nedvizhimost-i-rieltor", icon: Building, count: 31 },
  { name: "Транспорт и доставка", slug: "transport-i-dostavka", icon: Truck, count: 44 },
  { name: "Охрана и безопасность", slug: "ohrana-i-bezopasnost", icon: Shield, count: 15 },
  {
    name: "Производство и изготовление",
    slug: "proizvodstvo-i-izgotovlenie",
    icon: Factory,
    count: 27,
  },
  { name: "Агро и благоустройство", slug: "agro-i-blagoustrojstvo", icon: Sprout, count: 19 },
  { name: "Ритуальные услуги", slug: "ritualnye-usligi", icon: Flower, count: 11 },
];

export default function ServicesPage() {
  return (
    // Изменено: Используем системный фон вместо bg-gray-50
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero-блок с поисковой строкой */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Каталог услуг</h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-xl">
            Найдите специалиста среди 400+ проверенных исполнителей в Приднестровье
          </p>

          {/* Поисковая панель (адаптивный flex-ряд) */}
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

          {/* Виджет статистики */}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
