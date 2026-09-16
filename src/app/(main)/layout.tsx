import { headers } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SearchProvider } from "@/components/layout/search-context";
import { getCities } from "@/features/cities/queries";
import { auth } from "@/lib/auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Города нужны выбору города в поиске шапки. На главной их же запрашивает
  // Hero — повторного SELECT не будет: `getCities` обёрнута в `cache`.
  const [session, cities] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getCities(),
  ]);

  return (
    // Общее состояние поиска для шапки и Hero на главной: layout — их общий
    // родитель. Страница внутри провайдера остаётся серверным компонентом.
    <SearchProvider>
      <Header session={session} cities={cities} />
      <main className="flex-1">{children}</main>
      <Footer />
    </SearchProvider>
  );
}
