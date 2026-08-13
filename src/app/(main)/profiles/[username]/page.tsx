import { Building2, CheckCircle2, MapPin, Star, User } from "lucide-react";
import { notFound } from "next/navigation";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";

type ExecutorType = "individual" | "company";

// Временные данные — позже заменить на запрос к БД по username
const mockProfiles: Record<
  string,
  {
    name: string;
    type: ExecutorType;
    city: string;
    bio: string;
    rating: number;
    reviewsCount: number;
    memberSince: string;
    verified: boolean;
    listings: {
      id: string;
      title: string;
      categorySlug: string;
      city: string;
      imageUrl: string;
      price: string;
      rating: number;
      reviews: number;
    }[];
    reviews: {
      id: number;
      author: { name: string; initials: string };
      rating: number;
      date: string;
      text: string;
    }[];
  }
> = {
  "viktor-petrov": {
    name: "Виктор Петров",
    type: "individual",
    city: "Тирасполь",
    bio: "Выполняю электромонтажные работы любой сложности. Опыт более 10 лет, работаю аккуратно и качественно, даю гарантию на все виды работ.",
    rating: 4.9,
    reviewsCount: 127,
    memberSince: "января 2025",
    verified: true,
    listings: [
      {
        id: "1",
        title: "Электромонтажные работы любой сложности",
        categorySlug: "construction-and-renovation",
        city: "Тирасполь",
        imageUrl: "/u2.png",
        price: "от 80 руб./час",
        rating: 4.9,
        reviews: 127,
      },
      {
        id: "2",
        title: "Установка видеонаблюдения",
        categorySlug: "security",
        city: "Тирасполь",
        imageUrl: "/u4.png",
        price: "от 200 руб.",
        rating: 4.8,
        reviews: 34,
      },
      {
        id: "3",
        title: "Подключение электроплит",
        categorySlug: "construction-and-renovation",
        city: "Тирасполь",
        imageUrl: "/u6.png",
        price: "от 50 руб.",
        rating: 4.9,
        reviews: 19,
      },
    ],
    reviews: [
      {
        id: 1,
        author: { name: "Андрей П.", initials: "АП" },
        rating: 5,
        date: "15 мая 2026",
        text: "Отличный специалист! Сделал всё быстро и качественно. Заменил проводку во всей квартире за один день. Рекомендую!",
      },
      {
        id: 2,
        author: { name: "Марина К.", initials: "МК" },
        rating: 5,
        date: "3 мая 2026",
        text: "Виктор очень профессиональный мастер. Установил щиток и розетки, всё работает отлично. Цена адекватная.",
      },
      {
        id: 3,
        author: { name: "Дмитрий В.", initials: "ДВ" },
        rating: 4,
        date: "28 апреля 2026",
        text: "Хорошая работа, приехал вовремя, всё объяснил. Небольшая задержка по времени но результат отличный.",
      },
    ],
  },
  "marina-kovaleva": {
    name: "Марина Ковалёва",
    type: "individual",
    city: "Тирасполь",
    bio: "Заказываю услуги на платформе — сайты, ремонт, разовые задачи по дому.",
    rating: 0,
    reviewsCount: 0,
    memberSince: "марта 2025",
    verified: false,
    listings: [],
    reviews: [],
  },
  technoservice: {
    name: "ТехноСервис",
    type: "company",
    city: "Тирасполь",
    bio: "Сервисный центр по ремонту бытовой техники. Работаем с 2018 года, выезд мастера в день обращения, гарантия на все виды ремонта до 12 месяцев.",
    rating: 4.8,
    reviewsCount: 124,
    memberSince: "марта 2024",
    verified: true,
    listings: [
      {
        id: "4",
        title: "Ремонт стиральных машин",
        categorySlug: "repair-services",
        city: "Тирасполь",
        imageUrl: "/u1.png",
        price: "от 200 руб.",
        rating: 4.8,
        reviews: 124,
      },
      {
        id: "5",
        title: "Ремонт холодильников на дому",
        categorySlug: "repair-services",
        city: "Тирасполь",
        imageUrl: "/u3.png",
        price: "от 250 руб.",
        rating: 4.7,
        reviews: 58,
      },
    ],
    reviews: [
      {
        id: 1,
        author: { name: "Ольга С.", initials: "ОС" },
        rating: 5,
        date: "20 мая 2026",
        text: "Приехали в тот же день, починили машинку быстро, взяли адекватные деньги. Спасибо!",
      },
      {
        id: 2,
        author: { name: "Игорь Т.", initials: "ИТ" },
        rating: 4,
        date: "10 мая 2026",
        text: "Всё сделали качественно, но пришлось немного подождать мастера дольше обещанного.",
      },
    ],
  },
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = mockProfiles[username];

  if (!profile) {
    notFound();
  }

  const isCompany = profile.type === "company";
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Карточка профиля */}
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                    isCompany
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight">
                      {profile.name}
                    </h1>
                    {profile.verified && (
                      <CheckCircle2
                        className="h-5 w-5 text-brand flex-shrink-0"
                        aria-label="Проверенный аккаунт"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isCompany
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isCompany ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {isCompany ? "Компания" : "Частный специалист"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {profile.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    {profile.reviewsCount > 0 ? (
                      <>
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">
                          {profile.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({profile.reviewsCount} отзывов)
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">Пока нет отзывов</span>
                    )}
                    <span className="text-sm text-muted-foreground ml-2">
                      На платформе с {profile.memberSince}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            </div>

            {/* Объявления */}
            {profile.listings.length > 0 && (
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-3">
                  Объявления ({profile.listings.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Моковые данные: страница переводится на БД на этапе 1.3 */}
                  {profile.listings.map((listing) => (
                    <ServiceCard
                      key={listing.id}
                      id={Number(listing.id)}
                      title={listing.title}
                      categorySlug={listing.categorySlug}
                      city={listing.city}
                      price={listing.price}
                      authorName={profile.name}
                      authorType={profile.type === "company" ? "company" : "individual"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Отзывы */}
            {profile.reviews.length > 0 && (
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-4">
                  Отзывы ({profile.reviews.length})
                </h2>
                <div className="flex flex-col gap-3">
                  {profile.reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-xl p-4 bg-card/50">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand flex-shrink-0">
                            {review.author.initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {review.author.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              // biome-ignore lint/suspicious/noArrayIndexKey: static stars
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted/40"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Сайдбар — контакты */}
          <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0 sticky top-6">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-3">
                {isCompany ? "Свяжитесь с компанией" : "Свяжитесь с исполнителем"}
              </p>
              <Button className="w-full bg-brand hover:bg-brand/90 text-brand-foreground shadow cursor-pointer font-medium transition-colors">
                Показать контакты
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
