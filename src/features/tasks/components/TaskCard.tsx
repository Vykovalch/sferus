import { Building2, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import type { TaskCard as TaskCardData } from "@/features/tasks/queries";
import { formatRelativeDate, formatTaskBudget } from "@/lib/format";

interface TaskCardProps {
  task: TaskCardData;
  isFavorite?: boolean;
  isAuthenticated?: boolean;
}

/**
 * Карточка задания.
 *
 * Кликабельна целиком, но ссылкой обёрнут только заголовок: площадь даёт
 * `after:absolute after:inset-0`. Иначе кнопка избранного оказалась бы внутри
 * ссылки — см. комментарий в `ServiceCard`.
 */
export function TaskCard({ task, isFavorite = false, isAuthenticated = false }: TaskCardProps) {
  const isCompany = task.authorType === "company";

  return (
    <article className="relative bg-card border border-border rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Категория над заголовком */}
      <p className="text-xs text-muted-foreground font-medium mb-1">{task.categoryName}</p>

      {/* Заголовок + бюджет */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className="text-base font-medium text-foreground leading-snug">
          <Link href={`/tasks/${task.id}`} className="after:absolute after:inset-0">
            {task.title}
          </Link>
        </span>
        <span className="text-base font-medium text-foreground whitespace-nowrap flex-shrink-0">
          {formatTaskBudget(task.budget, task.isNegotiable)}
        </span>
      </div>

      {/* Описание */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {task.description}
      </p>

      {/* Мета-теги */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{task.cityName}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{formatRelativeDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Подвал карточки */}
      <div className="flex items-center gap-1.5 pt-3.5 border-t border-border">
        {isCompany ? (
          <Building2 className="h-3.5 w-3.5 text-muted-foreground/60" />
        ) : (
          <User className="h-3.5 w-3.5 text-muted-foreground/60" />
        )}
        <span className="text-xs text-muted-foreground font-medium">{task.authorName}</span>
        <FavoriteButton
          target={{ kind: "task", id: task.id }}
          isFavorite={isFavorite}
          isAuthenticated={isAuthenticated}
          className="relative z-10 ml-auto p-1 rounded-full hover:bg-muted"
        />
      </div>
    </article>
  );
}
