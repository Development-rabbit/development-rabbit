"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const testimonials = [
  {
    quote:
      "IndustryVR changed how we train our workforce. The simulations are realistic, scalable, and measurably reduced onboarding time.",
    author: "Marcus Johnson",
    role: "VP Operations, IndustryVR Partner",
  },
  {
    quote:
      "NursingVR gave our students a safe space to practice critical procedures. It is now a core part of our curriculum.",
    author: "Dr. Priya Sharma",
    role: "Director of Clinical Education",
  },
  {
    quote:
      "The team behind SchoolVR understands education. They built an experience our students actually want to learn in.",
    author: "James Wilson",
    role: "School District Technology Lead",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="insights" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by"
          highlight="visionary brands"
          description="Do not just take our word for it — hear from the founders and leaders we&apos;ve partnered with."
        />

        <div className="relative bg-white border border-line card-shadow rounded-3xl p-8 md:p-14">
          <Quote
            size={48}
            className="absolute top-8 right-8 text-accent/15"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="min-h-[220px] flex flex-col justify-center"
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-display font-medium leading-relaxed mb-8">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
              <div>
                <span className="block font-semibold text-foreground">
                  {testimonials[current].author}
                </span>
                <span className="text-sm text-muted">
                  {testimonials[current].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-surface-light border border-line flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-surface-light border border-line flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
            <div className="flex-1 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? "bg-accent w-6"
                      : "bg-foreground/15 hover:bg-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
