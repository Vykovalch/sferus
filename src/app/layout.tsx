import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
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
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

