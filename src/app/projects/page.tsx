import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";
import Footer from "../sections/Footer";
import ProjectsGrid from "./ProjectsGrid";
import { projects } from "../data/projects";

export const metadata: Metadata = {
  title: "All Projects — 8xWork",
  description:
    "Explore every project from 8xWork: VR training, immersive education, and modern web platforms.",
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            aria-label="8xWork home"
            className="hover:opacity-80 transition-opacity"
          >
            <Logo variant="wordmark" theme="light" className="h-9 w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </header>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="max-w-2xl mb-12 md:mb-16">
            <span className="inline-block mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
              Our Work
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              All projects,{" "}
              <span className="text-gradient">one place.</span>
            </h1>
            <p className="mt-4 text-muted leading-relaxed">
              Every immersive experience and platform we&apos;ve shipped — sort
              the grid to explore them your way.
            </p>
          </div>

          <ProjectsGrid items={projects} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
