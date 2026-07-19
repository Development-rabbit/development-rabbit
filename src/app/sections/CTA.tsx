"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-purple/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-2xl">
            Let&apos;s build something
            <br />
            <span className="text-gradient">extraordinary</span> together.
          </h2>

          <a
            href="mailto:hello@8xwork.com"
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-display font-semibold text-base bg-white text-black hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          >
            Book a Strategy Call
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
