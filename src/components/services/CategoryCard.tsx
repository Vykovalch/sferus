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
      className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0d7a5f] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col gap-3"
    >
      <div className="w-11 h-11 rounded-lg bg-[#0d7a5f]/8 flex items-center justify-center group-hover:bg-[#0d7a5f]/15 transition-colors">
        <Icon className="h-5 w-5 text-[#0d7a5f]" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900 leading-snug mb-1 group-hover:text-[#0d7a5f] transition-colors">
          {name}
        </h3>
        <p className="text-xs text-gray-400">{count} объявлений</p>
      </div>
    </Link>
  )
}