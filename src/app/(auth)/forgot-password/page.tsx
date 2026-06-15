import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Восстановление пароля — Sferus",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 transition-opacity hover:opacity-80">
        <Image src="/icon.svg" alt="Sferus" width={40} height={40} priority />
      </Link>

      <div className="w-full max-w-[400px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}