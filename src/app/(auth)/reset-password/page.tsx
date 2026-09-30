import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { LogoMark } from "@/components/shared/LogoMark";

export const metadata: Metadata = {
  title: "Новый пароль",
};

/**
 * `searchParams` — промис, и его нужно дождаться.
 *
 * До 2026-09-30 здесь стоял синхронный доступ с типом `{ token?: string }`.
 * В Next 15 такое ещё работало с предупреждением, в Next 16 синхронный доступ
 * убран совсем («Starting with Next.js 16, synchronous access is fully
 * removed» — `docs/01-app/02-guides/upgrading/version-16.md`), и обращение
 * к полю промиса молча давало `undefined`: форма сброса не получала токен.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-card md:bg-background md:items-center md:justify-center md:px-4 md:py-12">
      <div className="flex justify-center pt-10 pb-6 md:pt-0 md:pb-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoMark className="h-12" />
        </Link>
      </div>

      <div className="w-full md:max-w-[420px]">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
