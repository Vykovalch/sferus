import type { Metadata } from "next";
import Link from "next/link";
import { VerifyEmailClient } from "@/components/auth/VerifyEmailClient";
import { LogoMark } from "@/components/shared/LogoMark";

export const metadata: Metadata = {
  title: "Подтвердите email",
};

export default function VerifyEmailPage({ searchParams }: { searchParams: { email?: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-background md:items-center md:justify-center md:px-4 md:py-12">
      <div className="flex justify-center pt-10 pb-6 md:pt-0 md:pb-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoMark className="h-12" />
        </Link>
      </div>

      <div className="w-full md:max-w-[420px]">
        <VerifyEmailClient email={searchParams.email} />
      </div>
    </div>
  );
}
