import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface ServiceCardProps {
  id: string;
  title: string;
  category: string;
  city: string;
  imageUrl?: string | null;
  icon?: LucideIcon | null;
  href?: string;
}

export function ServiceCard({
  id,
  title,
  city,
  imageUrl,
  icon: Icon,
  href,
}: ServiceCardProps) {
  return (
    <Link
      href={href ?? `/services/listing/${id}`}
      className="group block cursor-pointer"
    >
      <Card className="pt-0 overflow-hidden border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-border/60 hover:shadow-md">
        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/8 to-brand/4">
              {Icon && (
                <Icon className="h-10 w-10 text-brand/25" strokeWidth={1.5} />
              )}
            </div>
          )}
        </div>

        <CardContent className="px-4 py-3">
          <h3 className="text-sm font-medium leading-snug text-foreground line-clamp-2 mb-2">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{city}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
