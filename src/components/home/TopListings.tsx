import { Zap, House, Hammer } from "lucide-react";
import { ServiceCard } from "@/components/shared/ServiceCard";

const listings = [
  {
    id: "1",
    title: "Ремонт стиральных машин",
    category: "Ремонт техники",
    city: "Тирасполь",
    imageUrl: "/master1.png",
    icon: null,
  },
  {
    id: "2",
    title: "Электромонтажные работы",
    category: "Электрика",
    city: "Бендеры",
    imageUrl: "/master2.png",
    icon: Zap,
  },
  {
    id: "3",
    title: "Уборка квартир и офисов",
    category: "Дом и быт",
    city: "Тирасполь",
    imageUrl: "/master2.jpg",
    icon: null,
  },
  {
    id: "4",
    title: "Ремонт сантехники",
    category: "Сантехника",
    city: "Рыбница",
    imageUrl: null,
    icon: House,
  },
  {
    id: "5",
    title: "Установка и ремонт окон и дверей",
    category: "Окна и двери",
    city: "Слободзея",
    imageUrl: null,
    icon: Hammer,
  },
  {
    id: "6",
    title: "Ремонт сантехники на дому",
    category: "Сантехника",
    city: "Рыбница",
    imageUrl: "/Услуга6.png",
    icon: House,
  },
];

export function TopListings() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-center mb-12">
          Топ объявления
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {listings.map((listing) => (
            <ServiceCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
