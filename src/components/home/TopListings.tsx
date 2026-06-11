import { Zap, House } from "lucide-react";
import { ServiceCard } from "@/components/shared/ServiceCard";

const listings = [
  {
    id: "1",
    title: "Ремонт стиральных машин",
    category: "Ремонт техники",
    imageUrl: "/master1.png",
    icon: null,
  },
  {
    id: "2",
    title: "Электромонтажные работы",
    category: "Электрика",
    imageUrl: "/master2.png",
    icon: Zap,
  },
  {
    id: "3",
    title: "Уборка квартир и офисов",
    category: "Дом и быт",
    imageUrl: "/master2.jpg",
    icon: null,
  },
  {
    id: "4",
    title: "Ремонт сантехники",
    category: "Сантехника",
    imageUrl: "/master4.png",
    icon: House,
  },
  {
    id: "5",
    title: "Установка кондиционеров",
    category: "Строительство и ремонт",
    imageUrl: "/blank.png",
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {listings.map((listing) => (
            <ServiceCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
