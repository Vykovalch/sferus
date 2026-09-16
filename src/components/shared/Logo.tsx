interface LogoProps {
  className?: string;
  variant?: "default" | "inverse";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  // Логотип набран цветом навигации шапки (`text-foreground`, #1C1C1C, как
  // пункты меню и «Войти») — решения владельца, 2026-09-16. Цвет бренда
  // остаётся на кнопках, ссылках и иконке сайта. Вариант по умолчанию стоит
  // только в шапке; `inverse` — белый логотип в подвале.
  const color = variant === "inverse" ? "text-white" : "text-foreground";

  return (
    <span
      className={`font-sans font-black tracking-tight leading-none ${color} ${className ?? ""}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Sferus
    </span>
  );
}
