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
  /** Появится вместе с загрузкой изображений. */
  imageUrl?: string | null;
}

export function ServiceCard({
  id,
  title,
  categorySlug,
  city,
  price,
  authorName,
  authorType,
  imageUrl,
}: ServiceCardProps) {
  const isCompany = authorType === "company";

  return (
    <Link
      href={`/services/${categorySlug}/${id}`}
      className="group bg-card border border-border rounded-2xl overflow-hidden transition-colors duration-200 hover:border-brand/40"
    >
      {/* Фото */}
      <div className="aspect-[1.5] relative overflow-hidden bg-muted">
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
        <FavoriteButton />
      </div>

      {/* Контент */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2">
          {title}
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
          <span>{price}</span>
        </div>
      </div>
    </Link>
  );
}
