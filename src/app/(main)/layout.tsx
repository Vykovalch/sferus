import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <>
      <Header session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}