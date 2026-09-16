interface LogoProps {
  className?: string;
  variant?: "default" | "inverse";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  // Логотип — фирменный яркий оранжевый, хотя как текст на светлом фоне
  // он даёт 2:1. WCAG прямо исключает логотипы из требований к контрасту
  // (1.4.3, «Logotypes»); остальной текст бренда — тёмная ступень --brand.
  const color = variant === "inverse" ? "text-white" : "text-brand-fill";

  return (
    <span
      className={`font-sans font-black tracking-tight leading-none ${color} ${className ?? ""}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      Sferus
    </span>
  );
}
