import { Link } from "react-router-dom";
import herosectionimage from "../assets/hero-section placeholder.jpg";

const primaryGlowStyle = {
  background: "radial-gradient(circle, #7B3FF2 0%, rgba(123,63,242,0) 70%)",
};

const royalGlowStyle = {
  background: "radial-gradient(circle, #4521A8 0%, rgba(69,33,168,0) 70%)",
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SparkleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M11.5 3.5 13.2 8.8l5.3 1.7-5.3 1.7-1.7 5.3-1.7-5.3-5.3-1.7 5.3-1.7Z" strokeLinejoin="round" />
    <path d="M18.5 15.5 19.2 17.5 21.2 18.2 19.2 18.9 18.5 20.9 17.8 18.9 15.8 18.2 17.8 17.5Z" strokeLinejoin="round" />
  </svg>
);

const GraduationCapIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M22 9 12 4 2 9l10 5 10-5Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 9v6" strokeLinecap="round" />
  </svg>
);

const FilmReelIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="12" cy="6.3" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="17.1" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="17.1" cy="14.8" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17.7" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="6.9" cy="14.8" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="6.9" cy="9.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
  </svg>
);

const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" strokeLinejoin="round" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const stats = [
  {
    icon: GraduationCapIcon,
    value: "12K",
    suffix: "+",
    label: "Creators Trained",
    desc: "From total beginners to studio-ready AI directors.",
  },
  {
    icon: FilmReelIcon,
    value: "500K",
    suffix: "+",
    label: "Videos Generated",
    desc: "Rendered by students inside hands-on lessons.",
  },
  {
    icon: StarIcon,
    value: "4.9",
    suffix: "/5",
    label: "Average Rating",
    desc: "Rated by creators across 40+ countries.",
  },
];

const About = () => (
  <div>
    {/* Intro */}
    <section className="relative overflow-hidden bg-gradient-to-t from-lavender/50 to-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20 text-center">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-white px-4 py-1.5 rounded-full mb-5">
          <SparkleIcon className="w-3.5 h-3.5" />
          About Us
        </span>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-ink mb-5 max-w-3xl mx-auto">
          We're <span className="text-primary">Development Rabbit</span>
        </h1>
        <p className="font-body text-brand-muted text-lg max-w-2xl mx-auto mb-8">
          An ed-tech venture focused on making AI content creation accessible and practical for everyday
          creators.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 bg-white border border-ink/10 rounded-full px-4 py-2 font-body text-sm text-ink">
            <MapPinIcon className="w-4 h-4 text-primary" />
            Giridih, Jharkhand, India
          </span>
          <a
            href="mailto:support@developmentrabbit.com"
            className="inline-flex items-center gap-2 bg-white border border-ink/10 rounded-full px-4 py-2 font-body text-sm text-ink hover:border-primary/40 transition-colors"
          >
            <MailIcon className="w-4 h-4 text-primary" />
            support@developmentrabbit.com
          </a>
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-br from-lavender via-white to-primary/10 aspect-[6/5] overflow-hidden order-2 lg:order-1">
            <img src={herosectionimage} alt="A creator building with Development Rabbit" className="w-full h-full object-cover" />
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
              Our Story
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-ink mb-5">
              Built From a <span className="text-primary">Side Experiment</span>
            </h2>
            <div className="flex flex-col gap-4 font-body text-brand-muted">
              <p>
                Development Rabbit started as a side experiment — testing whether AI video tools could replace an
                entire production crew for a single creator. After months of trial, error, and a growing folder
                of prompts that actually worked, we packaged everything we learned into a single course so other
                creators wouldn't have to start from zero.
              </p>
              <p>
                We built <span className="font-semibold text-ink">Prompt to Profit: The AI Video Creator Blueprint</span>{" "}
                to teach people — step by step — how to use AI video generation tools to create engaging,
                professional-quality content, from understanding the fundamentals of prompting to publishing and
                growing on platforms like Instagram. Alongside the main course, we offer{" "}
                <span className="font-semibold text-ink">The Prompt Vault</span>, a curated collection of
                ready-to-use AI prompts spanning realistic visuals and educational storytelling styles.
              </p>
              <p>
                We're a small, hands-on team building at the intersection of AI tools and content creation, and
                we're constantly refining our material based on what actually works on today's platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="relative overflow-hidden bg-[#4521A8]">
      <div
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={primaryGlowStyle}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={royalGlowStyle}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="block text-xs font-semibold tracking-wide text-lavender/70 mb-3">BY THE NUMBERS</span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-white">
            Results Creators Can <span className="text-white">See</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, desc }, i) => (
            <div
              key={label}
              className={`text-center ${i > 0 ? "sm:border-l sm:border-white/10" : ""}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 mx-auto">
                <Icon className="w-7 h-7" />
              </div>
              <p className="font-heading font-bold text-3xl text-white mb-1">
                {value}
                <span className="text-[#FFD700]">{suffix}</span>
              </p>
              <p className="font-body font-semibold text-white mb-1">{label}</p>
              <p className="font-body text-sm text-white/50 max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="relative overflow-hidden bg-lavender/70 py-20 sm:py-28">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-4xl sm:text-5xl leading-tight text-ink">
          <span className="block">
            Start <span className="text-primary">Directing</span>
          </span>
          <span className="block">
            With <span className="text-primary">AI</span> Today
          </span>
        </h2>
        <p className="font-body text-brand-muted mt-5 mb-8">
          Join a global community of AI filmmakers turning prompts into finished films, ads, and shorts — no crew
          required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
          >
            View All Courses
            <ArrowIcon />
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 rounded-full bg-white font-semibold text-ink border border-black/10 hover:border-black/20 transition-colors"
          >
            Start Creating Free
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default About;
