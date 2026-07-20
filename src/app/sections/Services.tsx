"use client";

import { motion } from "framer-motion";
import { Box, Glasses, Globe, ArrowRight, Sparkles } from "lucide-react";
import TiltCard from "../components/TiltCard";

function ArMockup() {
  return (
    <div className="relative h-40 mb-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 border border-line overflow-hidden shadow-inner">
      {/* dot-grid texture */}
      <div className="absolute inset-0 text-white/25 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* mesh glow blobs */}
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-cyan-300/40 blur-2xl" />
      <div className="absolute -bottom-8 -right-4 w-28 h-28 rounded-full bg-blue-800/30 blur-2xl" />

      {/* scan corners */}
      <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/50 rounded-tl-md" />
      <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/50 rounded-tr-md" />
      <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/50 rounded-bl-md" />
      <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/50 rounded-br-md" />

      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-1">
        <div className="absolute w-14 h-14 rounded-xl bg-white/40 blur-lg" />
        <div className="relative w-14 h-14 rounded-xl bg-white shadow-lg border border-line flex items-center justify-center rotate-6">
          <Box size={24} className="text-blue-600" />
        </div>
      </div>

      <div className="absolute -bottom-2 -right-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-line px-3 py-1.5 flex items-center gap-1.5 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
        </span>
        <span className="text-[10px] font-semibold text-foreground">
          Live Preview
        </span>
      </div>
    </div>
  );
}

function VrMockup() {
  return (
    <div className="relative h-40 mb-6 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-400 border border-line overflow-hidden flex items-center justify-center shadow-inner">
      {/* diagonal stripe texture */}
      <div className="absolute inset-0 text-white/10 bg-[repeating-linear-gradient(45deg,currentColor_0px,currentColor_1px,transparent_1px,transparent_12px)]" />

      {/* mesh glow blobs */}
      <div className="absolute -top-8 right-6 w-24 h-24 rounded-full bg-fuchsia-300/40 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-800/30 blur-2xl" />

      <div className="absolute w-24 h-16 rounded-xl bg-white/30 border border-white/40 shadow-sm rotate-[-10deg] -translate-x-10" />
      <div className="absolute w-24 h-16 rounded-xl bg-white/60 border border-white/50 shadow-sm rotate-6 translate-x-9 translate-y-2" />

      <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-lg border border-line flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
        <Glasses size={26} className="text-violet-600" />
      </div>

      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-line w-9 h-9 flex items-center justify-center rotate-6 transition-transform duration-500 group-hover:rotate-0">
        <Sparkles size={14} className="text-violet-600" />
      </div>

      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-line px-3 py-1.5 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
        <span className="text-[10px] font-semibold text-foreground">
          360° View
        </span>
      </div>
    </div>
  );
}

function WebMockup() {
  return (
    <div className="relative h-40 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-400 border border-line overflow-hidden shadow-inner">
      {/* blueprint grid texture */}
      <div className="absolute inset-0 text-white/20 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* mesh glow blobs */}
      <div className="absolute -top-8 -right-6 w-24 h-24 rounded-full bg-cyan-200/40 blur-2xl" />
      <div className="absolute -bottom-8 left-8 w-24 h-24 rounded-full bg-emerald-800/30 blur-2xl" />

      <div className="absolute inset-x-5 top-4 bottom-4 rounded-xl bg-white shadow-lg border border-line overflow-hidden -rotate-1 transition-transform duration-500 group-hover:rotate-0">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <div className="ml-2 h-2.5 flex-1 rounded-md bg-line" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-2.5 w-2/3 rounded-full bg-emerald-500/40" />
          <div className="h-1.5 w-full rounded-full bg-line" />
          <div className="h-1.5 w-5/6 rounded-full bg-line" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-6 flex-1 rounded-md bg-emerald-50 border border-line" />
            <div className="h-6 w-6 rounded-md bg-emerald-500/20 border border-line" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-2 -right-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-line px-3 py-1.5 flex items-center gap-1.5 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
        <Globe size={12} className="text-emerald-600" />
        <span className="text-[10px] font-semibold text-foreground">
          Responsive
        </span>
      </div>
    </div>
  );
}

const services = [
  {
    icon: Box,
    title: "AR Development",
    description:
      "Augmented experiences that connect your brand with the real world.",
    Mockup: ArMockup,
    tint: "text-blue-600",
  },
  {
    icon: Glasses,
    title: "VR Development",
    description:
      "Virtual experiences that immerse, engage, and leave a lasting impact.",
    Mockup: VrMockup,
    tint: "text-violet-600",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "High-performance websites and web apps built for scale and usability.",
    Mockup: WebMockup,
    tint: "text-emerald-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden">
      {/* Dot-grid texture, faded out at the edges */}
      <div
        aria-hidden
        className="absolute inset-0 text-accent/[0.09] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black_30%,transparent_100%)] pointer-events-none -z-10"
      />
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 translate-y-1/3 w-[450px] h-[450px] bg-accent-blue/10 rounded-full blur-[130px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-[0.35fr_0.65fr] gap-6 md:gap-12 mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground pt-2"
          >
            What we do
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Immersive. Intuitive.{" "}
              <span className="font-serif italic font-normal text-accent">
                Impactful.
              </span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-xl">
              We craft future-ready solutions using the power of AR, VR, and
              Web technologies.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-5 md:gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <TiltCard>
                <div className="group bg-surface-light border border-line rounded-3xl p-7 md:p-8 h-full hover:bg-white hover:border-accent/30 hover:card-shadow-lg transition-all duration-300">
                  <service.Mockup />

                  <div className="flex items-center gap-2 mb-3">
                    <service.icon size={18} className={service.tint} />
                    <h3 className="font-display text-2xl font-bold">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-muted leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-accent transition-colors"
                  >
                    Learn More
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}