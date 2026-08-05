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
    imageUrl: "/u1.png",
    price: "от 200 руб.",
    top: true,
    executor: { name: "ТехноСервис", type: "company" as const },
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    title: "Электромонтажные работы",
    category: "Электрика",
    city: "Бендеры",
    imageUrl: "/u2.png",
    price: "от 150 руб.",
    executor: { name: "Алексей Громов", type: "person" as const },
    rating: 4.5,
    reviews: 67,
  },
  {
    id: "3",
    title: "Уборка квартир и офисов",
    category: "Дом и быт",
    city: "Тирасполь",
    imageUrl: "/u3.png",
    price: "от 500 руб.",
    executor: { name: "CleanPro", type: "company" as const },
    rating: 4.9,
    reviews: 213,
  },
  {
    id: "4",
    title: "Установка кондиционеров",
    category: "Сантехника",
    city: "Рыбница",
    imageUrl: "/u4.png",
    price: "Договорная",
    executor: { name: "Дмитрий Коваль", type: "person" as const },
    rating: 4.2,
    reviews: 38,
  },
  {
    id: "5",
    title: "Установка и ремонт окон и дверей",
    category: "Окна и двери",
    city: "Слободзея",
    imageUrl: "/u5.png",
    price: "от 300 руб.",
    executor: { name: "ОкнаМастер", type: "company" as const },
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "6",
    title: "Ремонт сантехники на дому",
    category: "Сантехника",
    city: "Каменка",
    imageUrl: "/u6.png",
    price: "от 250 руб.",
    executor: { name: "Сергей Белов", type: "person" as const },
    rating: 4.6,
    reviews: 51,
  },
];

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
              href="/services"
              className="hover:text-brand transition-colors font-medium cursor-pointer"
            >
              Услуги
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium">
              Строительство и ремонт
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">Строительство и ремонт</h1>
        <div className="flex gap-6">
          {/* Сайдбар */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <CategorySidebar idPrefix="desktop" />
          </aside>

          {/* Контентная область */}
          <div className="flex-1 min-w-0">
            {/* Панель фильтров */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-input text-muted-foreground hover:bg-muted hover:text-foreground font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Фильтры</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto">
                    <CategorySidebar idPrefix="mobile" />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Список карточек */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockServices.map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>

            {/* Пагинация */}
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