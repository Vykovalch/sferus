import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// Выносим интерфейс, чтобы его можно было импортировать в другие файлы при необходимости
export interface ServiceCardProps {
  title: string;
  imageUrl: string;
  // Сюда в будущем легко добавим: price, rating, location, author и т.д.
}

export function ServiceCard({ title, imageUrl }: ServiceCardProps) {
  return (
    <Card className="w-full overflow-hidden border-0 bg-card transition-all duration-200 hover:translate-y-[-2px] hover:shadow-sm">
      <CardContent className="p-0">
        {/* Контейнер для изображения с фиксированным соотношением сторон 4:3 */}
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false} // Карточки ниже первого экрана не должны блокировать LCP
          />
        </div>

        {/* Контентная часть */}
        <div className="p-3">
          <h3 className="font-medium text-base text-brand-heading line-clamp-2 leading-tight min-h-[2.5rem]">
            {title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
