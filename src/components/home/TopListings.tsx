import { ServiceCard } from "@/components/shared/ServiceCard";

const listings = [
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
            <ServiceCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
