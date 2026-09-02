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
          src="/Logo.png"
          alt="Development Rabbit icon"
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
          alt="Development Rabbit"
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
        src="/Logo.png"
        alt="Development Rabbit icon"
        width={150}
        height={60}
        className="object-contain"
        priority
      />
      
    </div>
  );
}
