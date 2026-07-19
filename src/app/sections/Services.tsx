"use client";

import { motion } from "framer-motion";
import { Box, Glasses, Globe, ArrowRight } from "lucide-react";
import TiltCard from "../components/TiltCard";

const services = [
  {
    icon: Box,
    title: "AR Development",
    description:
      "Augmented experiences that connect your brand with the real world.",
    color: "#7c5cff",
  },
  {
    icon: Glasses,
    title: "VR Development",
    description:
      "Virtual experiences that immerse, engage, and leave a lasting impact.",
    color: "#3fd2ff",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "High-performance websites and web apps built for scale and usability.",
    color: "#a78bfa",
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
    <section id="services" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-block mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
              What we do
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Immersive. Intuitive.{" "}
              <span className="text-gradient">Impactful.</span>
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              We craft future-ready solutions using the power of AR, VR, and
              Web technologies.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="#services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent-purple transition-colors whitespace-nowrap"
          >
            Explore All Services
            <ArrowRight size={18} />
          </motion.a>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <TiltCard>
                <div className="group glass rounded-3xl p-8 md:p-10 h-full hover:bg-white/[0.06] transition-colors">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `${service.color}15`,
                      boxShadow: `0 0 30px ${service.color}20`,
                    }}
                  >
                    <service.icon size={28} style={{ color: service.color }} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-accent-purple transition-colors"
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
