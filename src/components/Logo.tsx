import type { CSSProperties } from "react";

type LogoVariant = "full" | "mark";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function Logo({
  variant = "full",
  className,
  style,
  ariaLabel = "Kylie Borge"
}: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox="0 0 64 64"
        className={className}
        style={style}
      >
        <defs>
          <linearGradient id="kbMarkGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e94b8a" />
            <stop offset="100%" stopColor="#f7a8c4" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="62" height="62" rx="16" fill="#0a0508" stroke="url(#kbMarkGrad)" strokeWidth="1.5" />
        <text
          x="32"
          y="43"
          textAnchor="middle"
          fontFamily="Great Vibes, cursive"
          fontSize="34"
          fill="url(#kbMarkGrad)"
        >
          KB
        </text>
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox="0 0 420 120"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="kbFullGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e94b8a" />
          <stop offset="100%" stopColor="#f7a8c4" />
        </linearGradient>
      </defs>
      <text
        x="210"
        y="60"
        textAnchor="middle"
        fontFamily="Great Vibes, cursive"
        fontSize="64"
        fill="url(#kbFullGrad)"
      >
        Kylie
      </text>
      <text
        x="210"
        y="104"
        textAnchor="middle"
        fontFamily="Bebas Neue, Oswald, Impact, sans-serif"
        fontSize="34"
        letterSpacing="10"
        fill="#ffffff"
      >
        BORGE
      </text>
    </svg>
  );
}
