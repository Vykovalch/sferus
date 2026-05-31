"use client";

import Link from "next/link";
import { MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type TaskStatus = "open" | "in_progress" | "done";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    category: string;
    city: string;
    budget: string;
    status: TaskStatus;
    responsesCount: number;
    createdAt: string;
    author: { name: string; initials: string };
  };
}

const statusLabels: Record<TaskStatus, string> = {
  open: "Открыто",
  in_progress: "В работе",
  done: "Завершено",
};

// Изменено: Безопасные цвета для темной и светлой тем через прозрачность альфа-канала
const statusColors: Record<TaskStatus, string> = {
  open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  done: "bg-muted text-muted-foreground",
};

const responsesLabel = (count: number) => {
  if (count === 1) return "1 отклик";
  if (count >= 2 && count <= 4) return `${count} отклика`;
  return `${count} откликов`;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    // Изменено: Убрали хардкод bg-white и серых рамок, добавили адаптивные переменные
    <div className="bg-card border border-border rounded-xl p-5 hover:border-brand/40 hover:shadow-sm transition-all duration-200 group">
      {/* Заголовок + бюджет */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-base font-medium text-foreground group-hover:text-brand transition-colors leading-snug cursor-pointer"
        >
          {task.title}
        </Link>
        <span className="text-base font-bold text-brand whitespace-nowrap flex-shrink-0">
          {task.budget}
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
          {statusLabels[task.status]}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          {task.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{task.city}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span>{task.createdAt}</span>
        </div>
      </div>

      {/* Подвал карточки */}
      <div className="flex items-center justify-between pt-3.5 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand/10 flex items-center justify-center text-[11px] font-bold text-brand">
            {task.author.initials}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{task.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>{responsesLabel(task.responsesCount)}</span>
          </div>
          <Button
            size="sm"
            className="h-8 px-4 text-xs bg-brand hover:bg-brand/90 text-brand-foreground shadow font-medium cursor-pointer transition-colors"
          >
            Откликнуться
          </Button>
        </div>
      </div>
    </div>
  );
}
