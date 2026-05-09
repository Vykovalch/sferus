import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Sferus — найдите специалиста в Приднестровье',
  description:
    'Платформа для поиска исполнителей и публикации заданий в Приднестровье. Ремонт, электрика, уборка, репетиторство и многое другое.',
  keywords: 'специалист, исполнитель, услуги, Тирасполь, Приднестровье, ПМР',
  openGraph: {
    title: 'Sferus — найдите специалиста в Приднестровье',
    description: 'Исполнители с отзывами из вашего города — для любой задачи',
    url: 'https://sferus.md',
    siteName: 'Sferus',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={geist.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
