import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  count: number;
  iconColor?: string;
  iconBg?: string;
}

export function CategoryCard({
  name,
  slug,
  icon: Icon,
  count,
  iconColor = "text-brand",
  iconBg = "bg-brand/10",
}: CategoryCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col items-center text-center gap-4 p-6 h-full bg-muted/50 rounded-2xl transition-all duration-200 hover:bg-white hover:shadow"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBg} transition-transform duration-200 group-hover:scale-110`}>
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-medium text-foreground leading-snug">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{count} объявлений</p>
      </div>
    </Link>
  );
}
