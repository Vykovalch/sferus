import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Plus, Eye, MessageSquare, Edit3, Power, PowerOff, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockServices = [
  { id: 1, title: "Электромонтажные работы", price: "от 80 руб./час", views: 45, responses: 8, active: true },
  { id: 2, title: "Установка видеонаблюдения", price: "от 200 руб.", views: 23, responses: 3, active: true },
  { id: 3, title: "Подключение электроплит", price: "от 50 руб.", views: 12, responses: 1, active: false },
];

export default async function MyServicesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/services");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium text-foreground">Мои услуги</h1>
          <Button asChild className="bg-brand hover:bg-brand/90 text-brand-foreground font-medium cursor-pointer">
            <Link href="/services/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить
            </Link>
          </Button>
        </div>

        {mockServices.length === 0 ? (
          <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
            <Megaphone className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Нет опубликованных услуг</p>
            <p className="text-xs text-muted-foreground mb-4">Создайте первую услугу, чтобы клиенты могли вас найти</p>
            <Button asChild variant="outline" className="border-brand text-brand hover:bg-brand/5 cursor-pointer">
              <Link href="/services/new">Создать объявление</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {mockServices.map((s) => (
              <div key={s.id} className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-base font-bold text-brand flex-shrink-0">
                  {s.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                  <p className="text-xs text-brand font-medium">{s.price}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{s.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{s.responses}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.active ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                  {s.active ? "Активно" : "Скрыто"}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer">
                    {s.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" asChild className="h-8 w-8 text-muted-foreground hover:text-brand cursor-pointer">
                    <Link href={`/services/${s.id}/edit`}><Edit3 className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
  