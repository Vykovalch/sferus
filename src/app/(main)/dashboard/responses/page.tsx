import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Send } from "lucide-react";

const mockResponses = [
  { id: 1, taskId: 2, taskTitle: "Разработка сайта-визитки для стоматологии", price: "600 руб.", text: "Занимаюсь разработкой сайтов 5 лет. Готов встретиться лично для обсуждения деталей.", status: "pending" as const, createdAt: "2 дня назад" },
  { id: 2, taskId: 3, taskTitle: "Нужен электрик для замены проводки в квартире", price: "450 руб.", text: "Выполню работу за 2 дня, даю гарантию на все виды работ.", status: "accepted" as const, createdAt: "5 дней назад" },
  { id: 3, taskId: 4, taskTitle: "Репетитор по английскому для ребёнка", price: "Договорная", text: "Работаю с детьми от 7 лет. Первое занятие бесплатно.", status: "rejected" as const, createdAt: "1 неделю назад" },
];

const statusLabels = { pending: "Ожидает", accepted: "Принят", rejected: "Отклонён" };
const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  accepted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-muted text-muted-foreground",
};

export default async function MyResponsesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/responses");

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Мои отклики</h1>

        {mockResponses.length === 0 ? (
          <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
            <Send className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Нет откликов</p>
            <p className="text-xs text-muted-foreground">Откликайтесь на задания — они появятся здесь</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mockResponses.map((r) => (
              <div key={r.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <Link href={`/tasks/${r.taskId}`} className="text-sm font-medium text-foreground hover:text-brand transition-colors leading-snug">
                    {r.taskTitle}
                  </Link>
                  <span className="text-sm font-bold text-brand whitespace-nowrap flex-shrink-0">{r.price}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{r.text}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>
                    {statusLabels[r.status]}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
