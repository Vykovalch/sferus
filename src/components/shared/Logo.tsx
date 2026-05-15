interface LogoProps {
  className?: string;
  compact?: boolean;
  footer?: boolean;
}

export function Logo({ className, compact = false, footer = false }: LogoProps) {
  const textColor = footer ? "#ffffff" : "#333333";

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
        <circle cx="24" cy="24" r="12" fill="#0d7a5f" />
        <text
          x="24"
          y="22"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="500"
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
        >
          S
        </text>
        {/* Внешнее кольцо */}
        <circle cx="24" cy="24" r="18" stroke="#0d7a5f" strokeWidth="2.5" fill="none" />
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
      <circle cx="24" cy="24" r="12" fill="#0d7a5f" />
      <text
        x="24"
        y="22"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="500"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        S
      </text>
      {/* Внешнее кольцо */}
      <circle cx="24" cy="24" r="18" stroke="#0d7a5f" strokeWidth="2.5" fill="none" />
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
    </svg>
  );
}
