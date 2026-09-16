"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroVideoBackground from "../components/HeroVideoBackground";

export default function Hero() {
  return (
    <section className="relative px-3 sm:px-5 lg:px-8 pt-24 sm:pt-28 pb-4">
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] noise shadow-[0_50px_120px_-50px_rgba(28,38,168,0.55)]">
        <HeroVideoBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-14 sm:pt-16 lg:pt-20">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
            {/* Copy */}
            <div className="max-w-2xl">
              {/* <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="inline-flex items-center gap-3 mb-7 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-white/85"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulseGlow" />
                AR / VR / Web Development Agency
              </motion.span> */}

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0, 0, 0.2, 1] }}
                className="font-instrument text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.02em] text-white mb-6"
              >
                You Dream,
                <br />
                We{" "}
                <span className="font-serif italic font-normal tracking-normal">
                  Design.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="text-base sm:text-lg text-white/75 max-w-xl leading-relaxed mb-9"
              >
                A premium development agency for visionary brands and
                high-growth companies. We design and build advanced AR, VR, and web
                experiences, improve your SEO, GEO visibility, and support your GST,
                taxation, and compliance needs.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-3 rounded-full pl-7 pr-2.5 py-2.5 w-full sm:w-auto font-display font-semibold text-sm bg-white text-accent hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_18px_40px_-12px_rgba(10,16,80,0.5)]"
                >
                  Book a Strategy Call
                  <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={15} />
                  </span>
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 w-full sm:w-auto font-display font-semibold text-sm text-white border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-300"
                >
                  View Our Work
                  <ArrowRight size={18} />
                </a>
              </motion.div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="glass-dark rounded-3xl p-6 lg:p-7 w-full max-w-sm lg:justify-self-end animate-float-slow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  One-Stop Growth Partner
                </h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-5">
                Focus on growing your business. We&apos;ll take care of the technology,
                visibility, compliance and all needs.
              </p>
              <div className="flex items-center gap-6 pt-4 border-t border-white/15">
                <div>
                  <span className="block font-display text-2xl font-bold text-white">
                    100+
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                    Products shipped
                  </span>
                </div>
                <div className="w-px h-9 bg-white/15" />
                <div>
                  <span className="block font-display text-2xl font-bold text-white">
                    23+
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                    Brands trust us
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Giant wordmark, cropped by the panel edge */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0, 0, 0.2, 1] }}
            aria-hidden
            className="select-none pointer-events-none text-center mt-8 sm:mt-10"
          >
            {/* Mobile: stacks into two lines */}
<span className="block sm:hidden font-instrument font-bold leading-[0.8] tracking-[-0.04em] text-[clamp(2.5rem,12vw,3.5rem)] bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent translate-y-[14%]">
  DEVELOPMENT
  <br />
  RABBIT
</span>

{/* Desktop and up: stays on one line */}
<span className="hidden sm:inline-block whitespace-nowrap font-instrument font-bold leading-[0.8] tracking-[-0.04em] text-[clamp(2.25rem,9vw,6.5rem)] bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent translate-y-[14%]">
  DEVELOPMENT RABBIT
</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
