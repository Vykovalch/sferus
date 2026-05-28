import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/shared/Logo";

export function AuthBrand() {
  return (
    <div className="dark hidden lg:flex flex-col justify-between p-12 text-foreground bg-zinc-950 relative overflow-hidden border-r border-border">
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-40 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-zinc-950" />
      </div>

      <Link href="/" className="relative z-10 inline-block cursor-pointer">
        <Logo variant="inverse" className="h-10 w-auto" />
      </Link>

      <div className="max-w-md relative z-10">
        <h1 className="text-4xl font-medium tracking-tight mb-4 text-zinc-50">
          Найдите специалиста в Приднестровье
        </h1>
        <p className="text-base md:text-lg text-zinc-400 font-normal leading-relaxed">
          Исполнители с отзывами из вашего города — для любой задачи
        </p>
      </div>

      <p className="text-zinc-600 text-xs font-normal relative z-10">
        © 2026 Sferus. Все права защищены.
      </p>
    </div>
  );
}
