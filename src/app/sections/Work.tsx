"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "IndustryVR",
    category: "Industrial Training",
    description: "VR simulations for manufacturing, logistics, and workplace safety.",
    image: "/industryvr.png",
    href: "https://industryvr.in/",
  },
  {
    title: "NursingVR",
    category: "Healthcare Education",
    description: "Immersive training for nursing professionals and clinical staff.",
    image: "/nursingvr.png",
    href: "https://nursingvr.in/",
  },
  {
    title: "DefenceVR",
    category: "Defence Simulation",
    description: "High-fidelity virtual training for defence and tactical readiness.",
    image: "/defencevr.png",
    href: "https://defencevr.in/",
  },
  {
    title: "SchoolVR",
    category: "Immersive Education",
    description: "Virtual classrooms and interactive learning experiences for students.",
    image: "/schoolvr.png",
    href: "https://schoolvr.us/",
  },
  {
    title: "Aonix",
    category: "Digital Platform",
    description: "A modern web platform designed for a forward-thinking tech brand.",
    image: "/aonix.png",
    href: "https://aonix.in/",
  },
  {
    title: "AegixCore",
    category: "Core Technology",
    description: "The foundational platform powering next-generation immersive solutions.",
    image: "/aegixcore.png",
    href: "https://www.aegixcore.com/",
  },
];

export default function Work() {
  return (
    <section id="work" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-block mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
              Our Work
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              Experiences that speak for{" "}
              <span className="text-gradient">themselves.</span>
            </h2>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            href="#work"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold glass hover:bg-white/10 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            View All Projects
            <ArrowRight size={16} />
          </motion.a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {projects.map((project, index) => (
            <motion.a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
              className="group relative flex flex-col rounded-3xl overflow-hidden glass hover:border-accent-purple/40 hover:shadow-[0_0_50px_rgba(124,92,255,0.15)] transition-all duration-500 cursor-pointer"
            >
              {/* Project screenshot */}
              <div className="relative h-52 md:h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} website preview`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Card body */}
              <div className="relative flex flex-col flex-1 p-6 md:p-7">
                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-blue mb-2">
                  {project.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm mb-5 flex-1">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    View Project
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent-purple group-hover:border-accent-purple group-hover:text-white transition-all duration-300">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
