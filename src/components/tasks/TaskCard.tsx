"use client";

import Link from "next/link";
import { MapPin, Clock, MessageSquare, User, Building2 } from "lucide-react";
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
    author: { name: string; type: "person" | "company" };
  };
}

const statusLabels: Record<TaskStatus, string> = {
  open: "Открыто",
  in_progress: "В работе",
  done: "Завершено",
};

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
    <Link
      href={`/tasks/${task.id}`}
      className="bg-card rounded-xl p-5 hover:shadow transition-all duration-200 block"
    >
      {/* Категория над заголовком */}
      <p className="text-xs text-muted-foreground font-medium mb-1">{task.category}</p>

      {/* Заголовок + бюджет */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className="text-base font-medium text-foreground leading-snug">{task.title}</span>
        <span className="text-base font-medium text-foreground whitespace-nowrap flex-shrink-0">
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
        <div className="flex items-center gap-1.5">
          {task.author.type === "company" ? (
            <Building2 className="h-3.5 w-3.5 text-muted-foreground/60" />
          ) : (
            <User className="h-3.5 w-3.5 text-muted-foreground/60" />
          )}
          <span className="text-xs text-muted-foreground font-medium">{task.author.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span>{responsesLabel(task.responsesCount)}</span>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="h-8 px-4 text-xs bg-card text-brand border border-brand/70 hover:bg-brand hover:text-brand-foreground hover:border-brand shadow-none font-medium cursor-pointer transition-colors"
          >
            Откликнуться
          </Button>
        </div>
      </div>
    </Link>
  );
}
