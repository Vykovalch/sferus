import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/shared/LogoMark";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Пароль изменён",
};

export default function ResetPasswordSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-card md:bg-background md:items-center md:justify-center md:px-4 md:py-12">
      <div className="flex justify-center pt-10 pb-6 md:pt-0 md:pb-8">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoMark className="h-12" />
        </Link>
      </div>

      <div className="w-full md:max-w-[420px] text-center animate-in fade-in duration-300 px-6 pb-10 md:pt-10 md:px-8 md:pb-8 md:rounded-2xl md:border md:border-border bg-card">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">Пароль изменён!</h1>
        <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed">
          Ваш пароль успешно обновлён. Теперь вы можете войти с новым паролем.
        </p>

        <Button
          asChild
          className="w-full bg-brand-fill hover:bg-brand-fill/90 text-brand-fill-foreground h-10 rounded-full text-base font-medium cursor-pointer transition-colors"
        >
          <Link href="/login">Войти в аккаунт</Link>
        </Button>
      </div>
    </div>
  );
}
