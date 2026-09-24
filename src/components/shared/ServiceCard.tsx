import { Building2, Camera, MapPin, User, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

export interface ServiceCardProps {
  id: number;
  title: string;
  /** Slug категории — часть адреса объявления. */
  categorySlug: string;
  city: string;
  /** Уже отформатированная цена: «от 80 руб. за час» либо «Договорная». */
  price: string;
  authorName: string;
  authorType?: "individual" | "company" | null;
  /** Первая фотография объявления; нет — заглушка с камерой. */
  imageUrl?: string | null;
  isFavorite?: boolean;
  isAuthenticated?: boolean;
}

/**
 * Карточка услуги.
 *
 * Ссылкой обёрнут заголовок, а не вся карточка: кликабельную площадь даёт
 * `after:absolute after:inset-0` поверх контейнера. Так кнопка избранного
 * оказывается рядом со ссылкой, а не внутри неё — форма внутри `<a>`
 * недопустима, и кнопка внутри ссылки была невалидной вложенностью.
 */
export function ServiceCard({
  id,
  title,
  categorySlug,
  city,
  price,
  authorName,
  authorType,
  imageUrl,
  isFavorite = false,
  isAuthenticated = false,
}: ServiceCardProps) {
  const isCompany = authorType === "company";

  return (
    // Контейнера у карточки нет (решение владельца, 2026-09-24): ни заливки,
    // ни рамки, ни тени. Форму задаёт сама фотография, карточки разделяет воздух —
    // так устроены витрины Avito, Ozon, Etsy и Airbnb. Прежняя рамка повторяла
    // линию фотографии второй раз, а на белой секции «Новые объявления» была
    // единственным, что отделяло белую карточку от белого фона.
    //
    // Рамки остаются у карточек без фотографии — задание, категория: там
    // контейнер и есть форма.
    <article className="group relative">
      {/* Фото: скругление и обрезка теперь здесь, а не на карточке */}
      <div className="aspect-[1.5] relative overflow-hidden rounded-2xl bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <FavoriteButton
          target={{ kind: "service", id }}
          isFavorite={isFavorite}
          isAuthenticated={isAuthenticated}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white"
        />
      </div>

      {/* Контент: боковых отступов нет — текст выравнивается по краям
          фотографии, а не по внутреннему полю исчезнувшей коробки. */}
      <div className="pt-3">
        {/* Отклик на наведение — подчёркивание названия и приближение
            фотографии выше. Тень и подъём убраны вместе с контейнером:
            они рисовали бы прямоугольник, которого больше нет. */}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:underline underline-offset-2 decoration-foreground/40">
          <Link href={`/services/${categorySlug}/${id}`} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 min-w-0">
          {isCompany ? (
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <User className="h-3.5 w-3.5 flex-shrink-0" />
          )}
          <span className="truncate">{authorName}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{city}</span>
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <Wallet className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{price}</span>
        </div>
      </div>
    </article>
  );
}
