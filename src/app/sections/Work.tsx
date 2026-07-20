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

// Split into two rows that scroll opposite directions. Uses a midpoint so it
// still divides sensibly if projects are added or removed later.
const midpoint = Math.ceil(projects.length / 2);
const rowOne = projects.slice(0, midpoint);
const rowTwo = projects.slice(midpoint);

// How many times each row's cards repeat back-to-back. More copies = more
// buffer, so the strip never runs dry on very wide monitors before it loops.
const REPEAT = 4;

function ProjectCard({ project, hidden = false }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className="group relative flex flex-col w-[280px] sm:w-[330px] md:w-[360px] shrink-0 rounded-3xl overflow-hidden bg-white border border-line card-shadow hover:border-accent/40 hover:card-shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-44 sm:h-52 md:h-56 overflow-hidden">
        <img
          src={project.image}
          alt={`${project.title} website preview`}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover object-top group-hover:scale-[1.06] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      <div className="relative flex flex-col flex-1 p-6 md:p-7">
        <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent mb-2">
          {project.category}
        </span>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-muted leading-relaxed text-sm mb-5 flex-1">
          {project.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-accent transition-colors">
            View Project
          </span>
          <div className="w-10 h-10 rounded-full bg-surface-light border border-line flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all duration-300">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </a>
  );
}

function MarqueeRow({ items, direction, duration }) {
  const track = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <div className="work-marquee-row relative overflow-hidden">
      <div
        className={`work-marquee-track flex w-max gap-5 md:gap-6 ${
          direction === "left" ? "animate-work-marquee-left" : "animate-work-marquee-right"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((project, i) => (
          <ProjectCard
            key={`${project.title}-${i}`}
            project={project}
            hidden={i >= items.length}
          />
        ))}
      </div>

      {/* Edge fades so cards don't feel like they're clipping abruptly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] -translate-y-1/2 pointer-events-none" />

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
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-white border border-line hover:border-accent/40 hover:text-accent transition-colors whitespace-nowrap self-start md:self-auto"
          >
            View All Projects
            <ArrowRight size={16} />
          </motion.a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 flex flex-col gap-5 md:gap-6"
      >
        <MarqueeRow items={rowOne} direction="left" duration={32} />
        {/* <MarqueeRow items={rowTwo} direction="right" duration={38} /> */}
      </motion.div>

      <style jsx global>{`
        @keyframes work-marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-25%);
          }
        }
        @keyframes work-marquee-right {
          from {
            transform: translateX(-25%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-work-marquee-left {
          animation-name: work-marquee-left;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-work-marquee-right {
          animation-name: work-marquee-right;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .work-marquee-row:hover .work-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-work-marquee-left,
          .animate-work-marquee-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}