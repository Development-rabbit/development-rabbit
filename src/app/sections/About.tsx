"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        {/* Statement heading */}
        <div className="grid md:grid-cols-[0.35fr_0.65fr] gap-6 md:gap-12 mb-14 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground pt-2"
          >
            About Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-[3.4rem] font-bold leading-[1.12] tracking-tight"
          >
            We turn bold ideas into immersive digital{" "}
            <span className="font-serif italic font-normal text-accent">
              experiences
            </span>{" "}
            that drive measurable growth.
          </motion.h2>
        </div>

        {/* Media + stat cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {/* Design image card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="group relative h-[320px] md:h-[400px] rounded-3xl overflow-hidden card-shadow"
          >
             <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
            >
              <source src="/nursing.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1233]/85 via-[#0e1233]/10 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white font-display font-semibold text-lg leading-snug">
              We design immersive experiences that feel intuitive and convert
              better.
            </p>
          </motion.div>

          {/* Video card */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="group relative h-[320px] md:h-[400px] rounded-3xl overflow-hidden card-shadow"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
            >
              <source src="/vid2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1233]/85 via-[#0e1233]/10 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white font-display font-semibold text-lg leading-snug">
              Strategy-led creativity, engineered for the immersive web.
            </p>
          </motion.div>

          {/* Stat card */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative h-[320px] md:h-[400px] rounded-3xl bg-accent-light border border-line p-8 flex flex-col justify-between card-shadow"
          >
            <div>
              <span className="block font-display text-6xl md:text-7xl font-bold text-accent tracking-tight mb-3">
                100+
              </span>
              <p className="text-muted leading-relaxed">
                Products shipped across AR, VR, Agents, Hardware and the web — for
                industry, healthcare, defence, and education.
              </p>
            </div>
            <div className="pt-6 border-t border-foreground/10">
              <span className="block font-display font-semibold text-foreground">
                Growth Delivered
              </span>
              <span className="text-sm text-muted">
                Trusted by 23+ innovative brands
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
