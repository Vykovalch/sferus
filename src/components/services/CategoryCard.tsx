import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  name: string
  slug: string
  icon: LucideIcon
  count: number
}

export function CategoryCard({ name, slug, icon: Icon, count }: CategoryCardProps) {
  return (
    <Link
      href={`/services/${slug}`}
      className="bg-background border border-border rounded-xl p-5 hover:border-brand/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-3 cursor-pointer"
    >
      <div className="w-11 h-11 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/15 transition-colors">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-foreground leading-snug mb-1 group-hover:text-brand transition-colors">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground">{count} объявлений</p>
      </div>
    </Link>
  )
}