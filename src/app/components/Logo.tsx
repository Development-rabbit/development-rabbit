"use client";

import Image from "next/image";

interface LogoProps {
  variant?: "wordmark" | "icon";
  /** Which background the logo sits on: "dark" panels get the white wordmark, "light" gets icon + ink text */
  theme?: "light" | "dark";
  className?: string;
}

export default function Logo({
  variant = "wordmark",
  theme = "light",
  className = "",
}: LogoProps) {
  if (variant === "icon") {
    return (
      <div className={`relative flex items-center ${className}`}>
        <Image
          src="/logo-icon.jpg"
          alt="8xWork icon"
          width={48}
          height={60}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  if (theme === "dark") {
    return (
      <div className={`relative flex items-center ${className}`}>
        <Image
          src="/Logo.png"
          alt="8xWork"
          width={160}
          height={56}
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo-icon.jpg"
        alt="8xWork icon"
        width={30}
        height={38}
        className="object-contain"
        priority
      />
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        8x<span className="text-accent">Work</span>
      </span>
    </div>
  );
}
