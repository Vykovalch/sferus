import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  // База для относительных адресов в метаданных: канонические ссылки
  // и картинки превью пишутся как `/path`, а наружу уходят абсолютными.
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — Найдите услугу в Приднестровье`,
    // Страницы задают только свою часть: «Уборка квартиры» → «Уборка квартиры — Sferus».
    // Раньше один и тот же заголовок стоял на всех страницах сразу.
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Платформа для поиска исполнителей и публикации заданий в Приднестровье. Ремонт, электрика, уборка, репетиторство и многое другое.",
  keywords: "специалист, исполнитель, услуги, Тирасполь, Приднестровье, ПМР",
  // `alternates.canonical` здесь не задаётся намеренно: метаданные наследуются
  // дочерними сегментами, и канонический адрес из корневого layout расползся бы
  // на все страницы сразу. `/login` объявлял бы себя копией главной — прямое
  // указание поисковику выбросить страницу из индекса как дубль.
  // Канонический адрес принадлежит странице и задаётся там.
  openGraph: {
    title: `${SITE_NAME} — Найдите услугу в Приднестровье`,
    // Было «Исполнители с отзывами из вашего города» — отзывов в v1 нет,
    // и обещать их в превью ссылки нельзя.
    description: "Исполнители из вашего города — для любой задачи",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
