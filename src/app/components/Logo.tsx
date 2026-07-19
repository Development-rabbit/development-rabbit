"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "wordmark" | "icon";
  className?: string;
}

export default function Logo({ variant = "wordmark", className = "" }: LogoProps) {
  const src = variant === "wordmark" ? "/Logo.png" : "/logo-icon.jpg";
  const alt = variant === "wordmark" ? "8xWork" : "8xWork icon";

  return (
    <div className={`relative flex items-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={variant === "wordmark" ? 160 : 48}
        height={variant === "wordmark" ? 56 : 60}
        className="object-contain"
        priority
      />
    </div>
  );
}
