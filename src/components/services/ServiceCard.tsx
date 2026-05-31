import Link from "next/link";
import { MapPin, Star, Building2, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    subcategory: string;
    executor: {
      name: string;
      initials: string;
      type: "individual" | "company";
      rating: number;
      reviewsCount: number;
    };
    city: string;
    price: number;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const isCompany = service.executor.type === "company";

  return (
    <Link href={`/services/listing/${service.id}`} className="block h-full select-none">
      <Card className="h-full bg-card border border-border hover:border-brand/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden">
        {/* Изображение / Заглушка */}
        <div className="h-36 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center relative">
          <span className="text-5xl font-bold text-brand/15 select-none">
            {service.title.charAt(0)}
          </span>

          {/* Бейдж подкатегории */}
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-background/90 backdrop-blur-sm text-brand text-xs font-medium rounded-md border border-brand/20 shadow-sm">
            {service.subcategory}
          </span>

          {/* Бейдж типа исполнителя */}
          <span
            className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border backdrop-blur-sm shadow-sm ${
              isCompany
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                : "bg-background/90 text-muted-foreground border-border"
            }`}
          >
            {isCompany ? (
              <Building2 className="h-3 w-3 flex-shrink-0" />
            ) : (
              <User className="h-3 w-3 flex-shrink-0" />
            )}
            {isCompany ? "Компания" : "Специалист"}
          </span>
        </div>

        <div className="p-4">
          {/* Название */}
          <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-3 group-hover:text-brand transition-colors leading-snug">
            {service.title}
          </h3>

          {/* Исполнитель */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                isCompany
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-brand/10 text-brand"
              }`}
            >
              {service.executor.initials}
            </div>
            <span className="text-sm text-muted-foreground font-medium truncate">
              {service.executor.name}
            </span>
          </div>

          {/* Мета */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/80 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span>{service.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{service.executor.rating}</span>
              <span className="text-muted-foreground/60">({service.executor.reviewsCount})</span>
            </div>
          </div>

          {/* Цена */}
          <div className="pt-3.5 border-t border-border flex items-center justify-between">
            <p className="text-base font-bold text-brand">от {service.price} руб.</p>
            <span className="text-xs text-brand font-medium group-hover:underline">
              Подробнее →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
