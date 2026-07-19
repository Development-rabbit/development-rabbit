"use client";

import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

export default function GradientButton({
  children,
  href = "#contact",
  variant = "primary",
  className = "",
  onClick,
}: GradientButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display font-semibold text-sm transition-all duration-300";

  const variants = {
    primary:
      "bg-gradient-to-r from-accent-coral via-accent-purple to-accent-blue text-white hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:-translate-y-0.5",
    secondary:
      "glass text-foreground hover:bg-white/10 hover:-translate-y-0.5",
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
