interface LogoProps {
  className?: string;
  variant?: "default" | "inverse";
}

function LogoText({ textColor }: { textColor: string }) {
  return (
    <g id="sferus-text-letters" fill={textColor}>
      <text
        x="0"
        y="32"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="26"
        fontWeight="600"
        fill={textColor} /* Цвет применяется напрямую к заливке букв */
        letterSpacing="0.5"
        transform="scale(1.3, 1.35)"
      >
        Sferus
      </text>
    </g>
  );
}

// 2. Основной компонент
export function Logo({ className, variant = "default" }: LogoProps) {
  /* Изменено: теперь по умолчанию (default) жестко задан цвет rgba(255, 255, 255, 0.9),
     который идеально совпадает с цветом ссылок навигации в Header */
  const textColor = variant === "inverse" ? "#ffffff" : "rgba(255, 255, 255, 0.9)";

  return (
    <svg
      viewBox="0 0 100 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sferus"
      role="img"
    >
      <LogoText textColor={textColor} />
    </svg>
  );
}
