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

  // Плотность 800, а не 900 (решение владельца, 2026-09-20): при 24px
  // с поджатым межбуквенным 900 давало глухую массу. 800 оставляет логотип
  // явно тяжелее всего вокруг — заголовки страниц и колонок подвала набраны
  // 600, пункты меню 500, — то есть он по-прежнему читается как знак, а не
  // как жирное слово. Inter подключён переменным шрифтом, поэтому ступень
  // настоящая: браузер не утолщает контуры сам.
  return (
    <span
      className={`font-sans font-extrabold tracking-tight leading-none ${color} ${className ?? ""}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Sferus
    </span>
  );
}
