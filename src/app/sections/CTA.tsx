"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import CalendlyWidget from "../components/CalendlyWidget";

export default function CTA() {
  return (
    <section id="contact" className="relative px-3 sm:px-5 lg:px-8 py-4 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] bg-accent-panel noise shadow-[0_50px_120px_-50px_rgba(28,38,168,0.55)]"
      >
        {/* Glow accents */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/15 blur-[120px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -right-24 w-[28rem] h-[28rem] rounded-full bg-accent-deep/60 blur-[130px] pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-20 md:py-28 text-center">
          <span className="inline-block mb-5 text-xs font-semibold tracking-[0.25em] uppercase text-white/70">
            Ready when you are
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            Let&apos;s build something{" "}
            <span className="font-serif italic font-normal">extraordinary</span>{" "}
            together.
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Tell us where you want to go — we&apos;ll design and build the
            immersive experience that gets you there.
          </p>
          <a
            href="mailto:hello@8xwork.com"
            className="group inline-flex items-center justify-center gap-3 rounded-full pl-7 pr-2.5 py-2.5 font-display font-semibold text-sm bg-white text-accent hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_18px_40px_-12px_rgba(10,16,80,0.5)]"
          >
            Book a Strategy Call
            <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight size={15} />
            </span>
          </a>

          <div className="mt-12 rounded-3xl bg-white p-2 sm:p-3 text-left overflow-hidden shadow-[0_30px_80px_-30px_rgba(10,16,80,0.6)]">
            <CalendlyWidget />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
