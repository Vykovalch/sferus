interface LogoProps {
  className?: string;
  compact?: boolean;
  variant?: "default" | "inverse";
}

// 1. Простой и быстрый функциональный компонент для иконки
function LogoIcon({ letterColor }: { letterColor: string }) {
  return (
    <g id="sferus-graphic-icon">
      <circle cx="24" cy="24" r="12" fill="var(--brand)" />
      {/* Буква S с жестким кроссбраузерным выравниванием */}
      <text
        x="24"
        y="24"
        dy="0.35em" /* Магический сдвиг, который компенсирует нижние метрики шрифта */
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22" /* Чуть уменьшил, чтобы буква сидела внутри круга аккуратнее */
        fontWeight="600"
        fill={letterColor}
        textAnchor="middle"
      >
        S
      </text>
      <circle cx="24" cy="24" r="18" stroke="var(--brand)" strokeWidth="2.5" fill="none" />
    </g>
  );
}

// 2. Такой же легкий компонент для текстовой части
function LogoText({ textColor }: { textColor: string }) {
  return (
    <g id="sferus-text-letters" fill={textColor}>
      <text
      x="52"
      y="32"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="500"
      fill={textColor}
      letterSpacing="-0.5"
    >
      sferus
    </text>
    </g>
  );
}

// 3. Основной компонент
export function Logo({ className, compact = false, variant = "default" }: LogoProps) {
  const textColor = variant === "inverse" ? "var(--background)" : "currentColor";
  const letterColor = variant === "inverse" ? "var(--foreground)" : "var(--primary-foreground)";

  if (compact) {
    return (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Sferus"
        role="img"
      >
        <LogoIcon letterColor={letterColor} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 180 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sferus"
      role="img"
    >
      <LogoIcon letterColor={letterColor} />
      <LogoText textColor={textColor} />
    </svg>
  );
}
