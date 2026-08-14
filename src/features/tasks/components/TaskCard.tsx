import { Building2, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import type { TaskCard as TaskCardData } from "@/features/tasks/queries";
import { TASK_STATUSES, type TaskStatus } from "@/lib/constants";
import { formatRelativeDate, formatTaskBudget } from "@/lib/format";

const statusColors: Record<TaskStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

interface TaskCardProps {
  task: TaskCardData;
}

export function TaskCard({ task }: TaskCardProps) {
  const isCompany = task.authorType === "company";

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="bg-card rounded-xl p-5 hover:shadow transition-all duration-200 block"
    >
      {/* Категория над заголовком */}
      <p className="text-xs text-muted-foreground font-medium mb-1">{task.categoryName}</p>

      {/* Заголовок + бюджет */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className="text-base font-medium text-foreground leading-snug">{task.title}</span>
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
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}
        >
          {TASK_STATUSES[task.status]}
        </span>
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
      </div>
    </Link>
  );
}
