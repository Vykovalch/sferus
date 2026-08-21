import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Войти",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white md:bg-background md:items-center md:justify-center md:px-4 md:py-12">
      {/* Логотип */}
      <div className="flex justify-center pt-10 pb-6 md:pt-0 md:pb-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image src="/icon.svg" alt="Sferus" width={40} height={40} priority />
        </Link>
      </div>

      {/* Форма */}
      <div className="w-full md:max-w-[400px]">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
