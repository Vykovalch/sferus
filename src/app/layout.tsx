import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans', // Изменено: Добавлена CSS-переменная для интеграции с Tailwind
})

export const metadata: Metadata = {
  title: 'Sferus — Найдите услугу в Приднестровье',
  description:
    'Платформа для поиска исполнителей и публикации заданий в Приднестровье. Ремонт, электрика, уборка, репетиторство и многое другое.',
  keywords: 'специалист, исполнитель, услуги, Тирасполь, Приднестровье, ПМР',
  openGraph: {
    title: 'Sferus — Найдите услугу в Приднестровье',
    description: 'Исполнители с отзывами из вашего города — для любой задачи',
    url: 'https://sferus.md',
    siteName: 'Sferus',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

