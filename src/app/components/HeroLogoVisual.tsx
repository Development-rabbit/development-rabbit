"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroLogoVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0, 0, 0.2, 1] }}
      className="relative w-full max-w-[500px] mx-auto aspect-square"
    >
      {/* Glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/40 via-accent-pink/30 to-accent-blue/40 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent-purple/20 rounded-full blur-[60px] animate-pulseGlow" />

      {/* 3D floating layers */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotateY: [0, 5, 0],
          rotateX: [0, -3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Back glass frame */}
        <div className="absolute inset-[10%] rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-sm transform translate-z-[-30px]" />

        {/* Main logo */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <Image
            src="/logo-icon.jpg"
            alt="8xWork 3D Logo"
            width={400}
            height={500}
            className="object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.4)]"
            priority
          />
        </div>

        {/* Floating accent orbs */}
        <div className="absolute top-[15%] right-[15%] w-16 h-16 rounded-full bg-gradient-to-br from-accent-coral to-accent-pink blur-sm opacity-80" />
        <div className="absolute bottom-[20%] left-[10%] w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple blur-sm opacity-70" />
      </motion.div>
    </motion.div>
  );
}
