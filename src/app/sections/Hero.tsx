"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroVideoBackground from "../components/HeroVideoBackground";

export default function Hero() {
  return (
    <section className="relative min-h-svh flex items-center pt-28 pb-20 overflow-hidden">
      <HeroVideoBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6">
        <div className="max-w-3xl">
          {/* <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-6 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-muted"
          >
            <span className="h-px w-8 bg-accent-purple" />
            AR / VR / Web Development Agency
          </motion.span> */}

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
            className="font-instrument text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.98] tracking-[-0.02em] mb-6"
          >
            You Dream,
            <br />
            <span className="text-gradient">We Design.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-9"
          >
            8xWork is a premium development agency for visionary brands and
            high-growth companies. We design and build advanced AR, VR, and
            Web experiences that drive real impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 w-full sm:w-auto font-display font-semibold text-sm bg-accent-purple text-white hover:bg-[#8f73ff] hover:shadow-[0_0_44px_rgba(124,92,255,0.45)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Book a Strategy Call
              <ArrowRight size={18} />
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 w-full sm:w-auto font-display font-semibold text-sm glass hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
            >
              View Our Work
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-accent-purple to-transparent" />
      </motion.div>
    </section>
  );
}
