import Link from "next/link";
import { ChevronRight, MapPin, Star, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceGallery } from "@/components/services/ServiceGallery";

type ExecutorType = "individual" | "company";

// Временные данные — позже заменить на запросы к БД
const mockListing = {
  id: 1,
  title: "Электромонтажные работы любой сложности",
  description:
    "Выполняю все виды электромонтажных работ: замена проводки, установка розеток и выключателей, монтаж щитков, подключение бытовой техники. Работаю аккуратно и качественно, даю гарантию на все виды работ. Опыт более 10 лет. Выезд в любую точку Тирасполя и пригорода.",
  price: 80,
  priceUnit: "час",
  category: "Строительство и ремонт",
  subcategory: "Электрика",
  city: "Тирасполь",
  experience: "Более 10 лет",
  homeVisit: true,
  images: ["/usluga1.jpg", "/usluga2.jpg", "/usluga3.jpg"],
  executor: {
    name: "Виктор Петров",
    initials: "ВП",
    type: "individual" as ExecutorType,
    rating: 4.9,
    reviewsCount: 127,
    listingsCount: 3,
    memberSince: "января 2025",
    verified: true,
  },
  otherListings: [
    { id: 2, title: "Установка видеонаблюдения", price: 200 },
    { id: 3, title: "Подключение электроплит", price: 50 },
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
};

export default function ServiceListingPage() {
  const { executor } = mockListing;
  const isCompany = executor.type === "company";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Хлебные крошки */}
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link
              href="/services"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              Услуги
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
            <Link
              href="/services/stroitelstvo-i-remont"
              className="hover:text-brand transition-colors cursor-pointer font-medium"
            >
              {mockListing.category}
            </Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
            <span aria-current="page" className="text-foreground font-medium line-clamp-1">{mockListing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Основной контент */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Основной блок */}
            <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm">
              {/* Заголовок + цена */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <h1 className="text-xl md:text-2xl font-medium text-foreground tracking-tight leading-tight">
                  {mockListing.title}
                </h1>
                <div className="sm:text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-brand">от {mockListing.price} руб.</div>
                  <div className="text-xs text-muted-foreground">за {mockListing.priceUnit}</div>
                </div>
              </div>

              {/* Бейджи */}
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {mockListing.subcategory}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MapPin className="h-3 w-3" />
                  {mockListing.city}
                </span>
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
              </div>

              {/* Галерея */}
              <div className="mb-6 rounded-xl overflow-hidden border border-border bg-card">
                <ServiceGallery images={mockListing.images} title={mockListing.title} />
              </div>

              {/* Описание */}
              <h2 className="text-sm font-medium text-foreground mb-2">Описание услуги</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {mockListing.description}
              </p>

              {/* Детали */}
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-medium text-foreground mb-3">Детали</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Стоимость</p>
                    <p className="text-sm font-medium text-foreground">
                      от {mockListing.price} руб./{mockListing.priceUnit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Город</p>
                    <p className="text-sm font-medium text-foreground">{mockListing.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Опыт работы</p>
                    <p className="text-sm font-medium text-foreground">{mockListing.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Выезд на дом</p>
                    <p className="text-sm font-medium text-foreground">
                      {mockListing.homeVisit ? "Да" : "Нет"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Другие объявления исполнителя */}
            {mockListing.otherListings.length > 0 && (
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-medium text-foreground mb-3">
                  Другие объявления этого исполнителя
                </h2>
                <div className="flex flex-col gap-2">
                  {mockListing.otherListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/services/listing/${listing.id}`}
                      className="flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-brand/50 bg-card/30 hover:bg-card/50 transition-all group cursor-pointer"
                    >
                      <span className="text-sm text-muted-foreground group-hover:text-brand transition-colors">
                        {listing.title}
                      </span>
                      <span className="text-sm font-medium text-brand flex-shrink-0 ml-4">
                        от {listing.price} руб.
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Отзывы */}
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-medium text-foreground mb-4">
                Отзывы ({mockListing.reviews.length})
              </h2>
              <div className="flex flex-col gap-3">
                {mockListing.reviews.map((review) => (
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
          </div>

          {/* Сайдбар — исполнитель */}
          <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0 sticky top-6">
            <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
              {/* Аватар + имя */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 ${
                    isCompany
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {executor.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {executor.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isCompany ? "Компания" : "Частный специалист"}
                  </p>
                </div>
              </div>

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
