import Image from "next/image";
import Link from "next/link";
import { MapPin, Wallet, User, Building2, Star } from "lucide-react";
import { FavoriteButton } from "@/components/shared/FavoriteButton";

export interface ServiceCardExecutor {
  name: string;
  type: "person" | "company";
}

export interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  city: string;
  imageUrl: string;
  price: string;
  top?: boolean;
  executor?: ServiceCardExecutor;
  rating?: number;
  reviews?: number;
}

export function ServiceCard({
  id,
  title,
  city,
  imageUrl,
  price,
  top,
  executor,
  rating,
  reviews,
}: ServiceCardProps) {
  return (
    <Link
      href={`/services/listing/${id}`}
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      {/* Фото */}
      <div className="aspect-[1.5] relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        {top && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">
            Топ
          </div>
        )}
        <FavoriteButton />
      </div>

      {/* Контент */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
          {title}
        </h3>

        {executor && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1 min-w-0">
              {executor.type === "company" ? (
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
              ) : (
                <User className="h-3.5 w-3.5 flex-shrink-0" />
              )}
              <span className="truncate">{executor.name}</span>
            </div>
            {rating && (
              <div className="flex items-center gap-0.5 flex-shrink-0 ml-2">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{rating}</span>
                {reviews && <span className="text-muted-foreground">({reviews})</span>}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{city}</span>
        </div>

        <div className="flex items-center gap-1 text-sm font-bold text-primary">
          <Wallet className="h-4 w-4 flex-shrink-0" />
          <span>{price}</span>
        </div>
      </div>
    </Link>
  );
}
