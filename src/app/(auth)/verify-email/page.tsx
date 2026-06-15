import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { VerifyEmailClient } from "@/components/auth/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Подтвердите email — Sferus",
};

export default function VerifyEmailPage({ searchParams }: { searchParams: { email?: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 transition-opacity hover:opacity-80">
        <Image src="/icon.svg" alt="Sferus" width={40} height={40} priority />
      </Link>

      <div className="w-full max-w-[400px]">
        <VerifyEmailClient email={searchParams.email} />
      </div>
    </div>
  );
}