import Image from "next/image";
import Link from "next/link";
import { MapPin, Wallet } from "lucide-react";

const listings = [
  {
    id: "1",
    title: "Ремонт стиральных машин",
    category: "Ремонт техники",
    city: "Тирасполь",
    imageUrl: "/u1.png",
    price: "от 200 руб.",
    top: true,
  },
  {
    id: "2",
    title: "Электромонтажные работы",
    category: "Электрика",
    city: "Бендеры",
    imageUrl: "/u2.png",
    price: "от 150 руб.",
    top: false,
  },
  {
    id: "3",
    title: "Уборка квартир и офисов",
    category: "Дом и быт",
    city: "Тирасполь",
    imageUrl: "/u3.png",
    price: "от 500 руб.",
    top: false,
  },
  {
    id: "4",
    title: "Установка кондиционеров",
    category: "Сантехника",
    city: "Рыбница",
    imageUrl: "/u4.png",
    price: "Договорная",
    top: false,
  },
  {
    id: "5",
    title: "Установка и ремонт окон и дверей",
    category: "Окна и двери",
    city: "Слободзея",
    imageUrl: "/u5.png",
    price: "от 300 руб.",
    top: false,
  },
  {
    id: "6",
    title: "Ремонт сантехники на дому",
    category: "Сантехника",
    city: "Каменка",
    imageUrl: "/u6.png",
    price: "от 250 руб.",
    top: false,
  },
];

export function TopListings() {
  return (
    <section className="py-16 bg-[#F2F3FF]">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Топ объявления</h2>
          <p className="text-muted-foreground mt-1">Рекомендованные специалисты в вашем регионе</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/services/listing/${listing.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300"
            >
              {/* Фото */}
              <div className="aspect-[1.5] relative overflow-hidden">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {listing.top && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                    Топ
                  </div>
                )}
              </div>

              {/* Контент */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{listing.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
                  <Wallet className="h-4 w-4 flex-shrink-0" />
                  <span>{listing.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
