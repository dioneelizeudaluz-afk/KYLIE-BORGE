import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base = variant === "primary" ? "btn-primary" : "btn-ghost";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
