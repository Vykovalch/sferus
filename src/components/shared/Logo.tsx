interface LogoProps {
  className?: string;
  variant?: "default" | "inverse";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const color = variant === "inverse" ? "text-white" : "text-primary";

  return (
    <span
      className={`font-sans font-black tracking-tight leading-none ${color} ${className ?? ""}`}
      style={{ fontFamily: "var(--font-sans)" }}      
    >
      Sferus
    </span>
  );
}