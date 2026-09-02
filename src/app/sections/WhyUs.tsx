"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Users, TrendingUp } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const reasons = [
  {
    icon: Zap,
    title: "Speed without sacrifice",
    description: "We move fast, but never compromise on craft or performance.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade quality",
    description:
      "Battle-tested architecture, security, and scalability from day one.",
  },
  {
    icon: Users,
    title: "Founder-led teams",
    description:
      "Senior talent directly on your project — no junior handoffs.",
  },
  {
    icon: TrendingUp,
    title: "Revenue-focused design",
    description:
      "Every interaction is designed to convert, engage, and retain users.",
  },
];

const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "12", label: "Countries served" },
  { value: "98%", label: "Client retention" },
  { value: "$2M+", label: "Revenue generated" },
];

export default function WhyUs() {
  return (
    <section id="about" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="Why Development Rabbit"
          title="Built for brands that"
          highlight="demand more"
          description="We don't just build websites and apps — we build competitive advantages through immersive technology."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center md:text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent-coral mx-auto md:mx-0 mb-5">
                <reason.icon size={24} />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">
                {reason.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-10 md:p-14"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
