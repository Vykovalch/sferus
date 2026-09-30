import type { Metadata } from "next";
import Link from "next/link";
import { VerifyEmailClient } from "@/components/auth/VerifyEmailClient";
import { LogoMark } from "@/components/shared/LogoMark";

export const metadata: Metadata = {
  title: "Подтвердите email",
};

/**
 * `searchParams` — промис (см. пояснение в `reset-password/page.tsx`).
 * При синхронном доступе, который стоял здесь до 2026-09-30, адрес почты
 * не доходил до компонента, и экран не мог ни назвать email, ни отправить
 * письмо повторно.
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-card md:bg-background md:items-center md:justify-center md:px-4 md:py-12">
      <div className="flex justify-center pt-10 pb-6 md:pt-0 md:pb-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoMark className="h-12" />
        </Link>
      </div>

      <div className="w-full md:max-w-[420px]">
        <VerifyEmailClient email={email} />
      </div>
    </div>
  );
}
