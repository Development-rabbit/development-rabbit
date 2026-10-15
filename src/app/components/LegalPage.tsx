import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import Footer from "../sections/Footer";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <main className="relative min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Development Rabbit home"
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

        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6">
          <div className="mb-10 md:mb-14">
            <span className="inline-block mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-muted">
              {eyebrow}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight">
              {title}
            </h1>
            <p className="mt-4 text-sm text-muted">
              Last updated: {lastUpdated}
            </p>
          </div>

          <article className="legal-content">{children}</article>
        </div>
      </section>

      <Footer />
    </main>
  );
}
