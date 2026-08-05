import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";

const mockFavorites = [
  { id: 1, title: "Ремонт стиральных машин", category: "Ремонт техники", executor: "Александр М.", city: "Тирасполь", price: "от 150 руб.", rating: 4.9 },
  { id: 2, title: "Уборка квартир и офисов", category: "Дом, быт и уход", executor: "Екатерина Л.", city: "Тирасполь", price: "от 200 руб.", rating: 4.8 },
];

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?callbackUrl=/dashboard/favorites");

  return (
    <>
      <h1 className="text-xl font-medium text-foreground mb-6">Избранное</h1>

        {mockFavorites.length === 0 ? (
          <div className="bg-background border border-dashed border-border rounded-xl p-10 text-center">
            <Heart className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Нет сохранённых услуг</p>
            <p className="text-xs text-muted-foreground mb-4">Добавляйте понравившихся специалистов в избранное</p>
            <Link href="/services" className="text-sm text-brand hover:underline font-medium">
              Перейти к услугам →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {mockFavorites.map((f) => (
              <Link key={f.id} href={`/services/listing/${f.id}`} className="block">
                <div className="bg-background border border-border rounded-xl p-4 shadow-sm hover:border-brand/40 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground">{f.category}</span>
                      <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors mt-0.5 mb-2">{f.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{f.executor}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{f.city}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{f.rating}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand">{f.price}</p>
                      <button
                        type="button"
                        className="mt-2 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Удалить из избранного"
                      >
                        <Heart className="h-4 w-4 fill-red-400 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
    </>
  );
}
