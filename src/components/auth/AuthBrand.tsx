import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";

export function AuthBrand() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden">
      {/* Фон как в Hero */}
      <div className="absolute inset-0">
        <Image src="/hero-bg.jpg" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/75 to-slate-900/80" />
      </div>

      {/* Контент поверх фона */}
      <Link href="/" className="relative z-10">
        <Logo footer className="h-12" />
      </Link>

      <div className="max-w-md relative z-10">
        <h1 className="text-4xl font-semibold mb-8">Найдите специалиста в Приднестровье</h1>
        <p className="text-lg text-white/70">
          Исполнители с отзывами из вашего города — для любой задачи
        </p>
      </div>

      <p className="text-white/40 text-sm relative z-10">© 2026 Sferus</p>
    </div>
  );
}
