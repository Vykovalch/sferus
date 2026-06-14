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
      className="flex flex-col gap-4 p-6 h-full cursor-pointer bg-card rounded-2xl
        ring-1 ring-black/[0.04] dark:ring-white/[0.06]
        shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]
        will-change-transform transition-all duration-200 ease-out
        hover:-translate-y-0.5
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_16px_40px_rgba(0,0,0,0.10)]
        hover:ring-black/[0.08] dark:hover:ring-white/[0.10]
        group"
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${iconBg} transition-transform duration-200 group-hover:scale-110`}
      >
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>

      <div className="flex flex-col gap-1 mt-auto">
        <h3 className="text-sm font-medium leading-snug">{name}</h3>
        <p className="text-xs text-muted-foreground">{count} объявлений</p>
      </div>
    </Link>
  );
}
