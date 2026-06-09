import Link from "next/link";
import { ArrowRight, Wrench, Zap, House, Paintbrush, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Ремонт", icon: Wrench, slug: "remont", count: "120+" },
  { name: "Электрика", icon: Zap, slug: "elektrika", count: "85+" },
  { name: "Сантехника", icon: House, slug: "santehnika", count: "95+" },
  { name: "Покраска", icon: Paintbrush, slug: "pokraska", count: "60+" },
  { name: "IT услуги", icon: Monitor, slug: "it", count: "45+" },
];

export function PopularServices() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-12 text-foreground">
          Популярные услуги
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/services?category=${cat.slug}`} className="h-full">
                {/* ИЗМЕНЕНО: Заменили border-0 на !border-0, чтобы принудительно перекрыть внутренние стили shadcn карточки */}
                <Card className="cursor-pointer bg-card dark:bg-card/40 text-card-foreground h-full group !border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl active:scale-[0.99]">
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                    <div className="p-3.5 bg-brand/5 dark:bg-brand/10 rounded-2xl text-brand group-hover:scale-110 transition-transform duration-300 mb-4">
                      <Icon className="h-6 w-6 stroke-[2]" />
                    </div>

                    <h3 className="text-base font-semibold mb-1 text-foreground tracking-tight">
                      {cat.name}
                    </h3>

                    <p className="text-sm text-muted-foreground font-normal">
                      <span className="font-semibold text-foreground/80">{cat.count}</span>{" "}
                      объявлений
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Карточка "Смотреть все" — ТОЖЕ ИЗМЕНЕНО на !border-0 */}
          <Link href="/services" className="h-full">
            <Card className="cursor-pointer bg-card dark:bg-card/40 text-card-foreground h-full group !border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl active:scale-[0.99]">
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="p-3.5 bg-brand/5 dark:bg-brand/10 rounded-2xl text-brand mb-4">
                  <ArrowRight className="h-6 w-6 stroke-[2] transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                <h3 className="text-base font-semibold text-foreground tracking-tight">
                  Смотреть все
                </h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
