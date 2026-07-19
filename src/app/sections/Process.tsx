"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We explore your goals, audience, and vision to define the opportunity.",
  },
  {
    number: "02",
    title: "Strategize",
    description:
      "We map the project plan, tech stack, and experience strategy.",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We craft interfaces, interactions, and aesthetics with usability in mind.",
  },
  {
    number: "04",
    title: "Develop",
    description:
      "We build with precision using cutting-edge technologies.",
  },
  {
    number: "05",
    title: "Deliver",
    description:
      "We launch, optimize, and support the experience post go-live.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
              Our Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Precision at every step.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-end"
          >
            <p className="text-muted leading-relaxed max-w-md">
              A proven process designed to turn your vision into powerful
              digital experiences.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute -top-3 left-0 w-6 h-6 rounded-full bg-background border-2 border-accent-purple items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-accent-purple" />
                </div>

                <span className="font-display text-5xl font-bold text-white/10 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
