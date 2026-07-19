"use client";

import { motion } from "framer-motion";

const brands = [
  "CUMMINS",
  "TATA",
  "AIIMS PATNA",
  "AONIX",
  "AEGIXCORE",
  "DEFENCEVR",
  "NURSINGVR",
];

export default function TrustedBy() {
  return (
    <section className="relative py-12 border-y border-white/10 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-muted mb-8"
        >
          Trusted by innovative brands
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
        >
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-lg md:text-xl font-display font-bold text-white/40 hover:text-white/70 transition-colors tracking-wider"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
