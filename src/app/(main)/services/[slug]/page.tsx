"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { CategorySidebar } from "@/components/services/CategorySidebar";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const mockServices = [
  {
    id: "1",
    title: "Ремонт стиральных машин",
    category: "Ремонт техники",
    city: "Тирасполь",
    imageUrl: "/master1.jpg",
    icon: null,
  },
  {
    id: "2",
    title: "Ремонт и замена труб, установка сантехники",
    category: "Сантехника",
    city: "Бендеры",
    imageUrl: "/master1.jpg",
    icon: null,
  },
  {
    id: "3",
    title: "Штукатурка, шпаклёвка, покраска стен",
    category: "Отделка",
    city: "Тирасполь",
    imageUrl: "/master1.jpg",
    icon: null,
  },
  {
    id: "4",
    title: "Кровельные работы, ремонт крыши",
    category: "Кровля",
    city: "Рыбница",
    imageUrl: "/master1.jpg",
    icon: null,
  },
  {
    id: "5",
    title: "Установка и ремонт окон и дверей",
    category: "Окна и двери",
    city: "Тирасполь",
    imageUrl: "/master1.jpg",
    icon: null,
  },
  {
    id: "6",
    title: "Заливка фундамента, бетонные работы",
    category: "Фундамент",
    city: "Бендеры",
    imageUrl: "/master1.jpg",
    icon: null,
  },
];

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 select-none">
            <Link
              href="/services"
              className="hover:text-brand transition-colors font-medium cursor-pointer"
            >
              Услуги
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">Строительство и ремонт</span>
          </nav>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Строительство и ремонт</h1>
            <p className="text-sm text-muted-foreground mt-0.5">120 объявлений</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar idPrefix="desktop" />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-muted-foreground">
                Найдено <span className="text-foreground font-semibold">120</span> объявлений
              </p>

              {/* Кнопка фильтров — только на мобильных */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="lg:hidden h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <CategorySidebar idPrefix="mobile" />
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-10 select-none">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="h-9 border-input text-muted-foreground"
              >
                Назад
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  type="button"
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className={`w-9 h-9 p-0 font-medium cursor-pointer transition-colors ${
                    page === 1
                      ? "bg-brand hover:bg-brand/90 text-brand-foreground shadow-sm"
                      : "border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
              >
                Вперёд
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
