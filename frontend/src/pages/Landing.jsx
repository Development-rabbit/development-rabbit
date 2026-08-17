import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCourses } from "../api/courses";
import ContinueLearningSection from "../components/ContinueLearningSection";
import Rabbit from "../assets/rabbit.png";
import RabbitPurple from "../assets/rabbit-purple.png";
import herosectionimage from "../assets/hero-section placeholder.jpg";
import texttovideo from "../assets/text-to-video.jpeg";
import aiediting from "../assets/ai-powered-video-editing.jpeg";
import imagetovideo from "../assets/image-to-video.jpeg";
import first from "../assets/1st.png";
import second from "../assets/2nd.png";
import third from "../assets/3rd.png";

import filler_one from "../assets/circle_filler/1.png"
import filler_two from "../assets/circle_filler/2.png"
import filler_three from "../assets/circle_filler/3.png"
import filler_four from "../assets/circle_filler/4.jpeg"

const dotGridStyle = {
  backgroundImage: "radial-gradient(circle, #7b3ff257 2px, transparent 1px)",
  backgroundSize: "18px 18px",
};

const primaryGlowStyle = {

};

const royalGlowStyle = {
  background: "radial-gradient(circle, #4521A8 0%, rgba(69,33,168,0) 70%)",
};

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarRow = () => (
  <div className="flex gap-0.5 text-primary" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
      </svg>
    ))}
  </div>
);

const StarIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor">
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
  </svg>
);

const GraduationCapIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M22 9 12 4 2 9l10 5 10-5Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 9v6" strokeLinecap="round" />
  </svg>
);

const UsersIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.2 2.6-5.5 5.8-5.5s5.8 2.3 5.8 5.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.5 4.7a3.2 3.2 0 0 1 0 6.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.3 14.8c2.1.6 3.6 2.5 3.6 5.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookOpenIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path
      d="M12 6.5c-1.8-1.4-4.6-1.8-7-1V17c2.4-.8 5.2-.4 7 1 1.8-1.4 4.6-1.8 7-1V5.5c-2.4-.8-5.2-.4-7 1Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 6.5V18" strokeLinecap="round" />
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

const SparkleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M11.5 3.5 13.2 8.8l5.3 1.7-5.3 1.7-1.7 5.3-1.7-5.3-5.3-1.7 5.3-1.7Z" strokeLinejoin="round" />
    <path d="M18.5 15.5 19.2 17.5 21.2 18.2 19.2 18.9 18.5 20.9 17.8 18.9 15.8 18.2 17.8 17.5Z" strokeLinejoin="round" />
  </svg>
);

const TimelineIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="14.5" width="18" height="5.5" rx="1.5" />
    <rect x="6" y="14.5" width="5" height="5.5" fill="currentColor" stroke="none" />
    <path d="M6 11V4M10 11V6.5M14 11V3.5M18 11V7" strokeLinecap="round" />
  </svg>
);

const ImagePlayIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <circle cx="8.3" cy="9.3" r="1.4" />
    <path d="M3.8 16.5 8.5 11.8a1.4 1.4 0 0 1 2 0l3.8 3.8" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="13.5,12.8 13.5,17.8 17.5,15.3" fill="currentColor" stroke="none" />
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

const features = [
  {
    icon: BookOpenIcon,
    title: "Structured Learning Paths",
    desc: "Follow a guided curriculum from prompt-writing basics to advanced camera control and scene direction.",
  },
  {
    icon: SparkleIcon,
    title: "Real Render Practice",
    desc: "Practice with live generation credits for Runway, Pika, and Kling so every lesson ends with a finished clip.",
  },
  {
    icon: UsersIcon,
    title: "Working Creator Mentors",
    desc: "Get feedback from working AI filmmakers and editors who review your renders and portfolio.",
  },
];

const ImpactSection = () => (
  <section className="relative">
    <div className="relative overflow-hidden bg-[#4521A8]">
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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid lg:grid-cols-[minmax(0,300px)_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <span className="block text-center md:text-left text-xs font-semibold tracking-wide text-lavender/70 mb-3">BY THE NUMBERS</span>
            <h2 className="font-heading text-center md:text-left font-bold text-3xl sm:text-4xl leading-tight text-white">
              Results Creators Can <span className="text-white">See</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 text-center md:text-left gap-4 sm:gap-6">
            {stats.map(({ icon: Icon, value, suffix, label, desc }, i) => (
              <div key={label} className={i > 0 ? "sm:border-l sm:border-white/10 sm:pl-6" : ""}>
                <div className="mx-auto md:mx-0 w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <p className="font-heading font-bold text-3xl text-white mb-1">
                  {value}
                  <span className="text-[#FFD700]">{suffix}</span>
                </p>
                <p className="font-body text-sm md:text-2xl font-semibold text-white mb-1">{label}</p>
                <p className="font-body hidden md:block text-sm text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="relative bg-white">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-sm font-semibold text-primary bg-lavender px-4 py-1.5 rounded-full mb-5">
          Why Choose Us
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-ink mb-12">
          Everything You Need to <span className="text-primary">Direct with AI</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-ink/10 rounded-2xl p-7 hover:border-primary/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-lavender flex items-center justify-center text-primary mb-5">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-ink mb-2">{title}</h3>
              <p className="font-body  text-sm text-brand-muted mb-4">{desc}</p>
              <span className="block w-8 h-0.5 bg-primary" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LessonsIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8.5 8h7M8.5 12h7M8.5 16h4" strokeLinecap="round" />
  </svg>
);

const subjects = [
  {
    img: texttovideo,
    icon: FilmReelIcon,
    category: "Text-to-Video",
    duration: "8 hrs 20 min",
    lessons: "16 Lessons",
    title: "Text-to-Video Mastery",
    desc: "Write cinematic prompts and direct Runway, Sora, and Kling to get consistent, high-quality shots.",
  },
  {
    img: aiediting,
    icon: TimelineIcon,
    category: "AI Editing",
    duration: "6 hrs 45 min",
    lessons: "14 Lessons",
    title: "AI-Powered Editing",
    desc: "Cut, grade, and sound-design AI footage into a polished story using CapCut and Premiere.",
  },
  {
    img: imagetovideo,
    icon: ImagePlayIcon,
    category: "Image-to-Video",
    duration: "7 hrs 15 min",
    lessons: "13 Lessons",
    title: "Image-to-Video Animation",
    desc: "Turn still frames and product photos into motion with Kling, Luma, and Pika workflows.",
  },
];

const SubjectsSection = () => (
  <section className="relative overflow-hidden bg-[#e9e9f24d]">
    <div
      className="hidden md:block absolute right-0 top-0 bottom-0 w-48"
      style={dotGridStyle}
      aria-hidden="true"
    />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <span className="inline-block text-sm font-semibold text-primary bg-white px-4 py-1.5 rounded-full mb-5">
            Course Tracks
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-ink">
            Master Every <span className="text-primary">AI Video Tool</span>
          </h2>
        </div>


      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(({ icon: Icon, img, category, duration, lessons, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-lavender via-white to-primary/10 flex items-center justify-center">
              <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-9 h-9 rounded-lg bg-lavender flex items-center justify-center text-primary shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-body text-sm font-semibold text-ink">{category}</span>
              </div>



              <h3 className="font-heading font-bold text-xl text-ink mb-2">{title}</h3>
              <p className="font-body text-sm text-brand-muted mb-6 flex-1">{desc}</p>

              <Link
                to="/courses"
                className="inline-flex self-start items-center gap-2 text-sm font-semibold text-primary border border-primary/30 rounded-full px-5 py-2.5 hover:bg-primary/5 transition-colors"
              >
                Learn More
                <ArrowIcon />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PlayIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M10 9.5v5l4.5-2.5Z" strokeLinejoin="round" />
  </svg>
);

const ClipboardCheckIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 3.2h6a1 1 0 0 1 1 1V6H8V4.2a1 1 0 0 1 1-1Z" />
    <path d="m8.5 13 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const demoFeatures = [
  {
    icon: PlayIcon,
    title: "Watch a Free Lesson",
    desc: "Preview a full prompt-to-render walkthrough before you enroll.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Try a Prompt Challenge",
    desc: "Test your prompting skills and get instant feedback on your render.",
  },
];

const DemoSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-ink via-deep-purple to-ink">
    <div
      className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
      style={royalGlowStyle}
      aria-hidden="true"
    />
    <div
      className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
      style={primaryGlowStyle}
      aria-hidden="true"
    />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div>
          <div className="relative rounded-2xl border border-white/10 bg-charcoal aspect-[4/3] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-royal-purple/30" />
            <span className="relative w-16 h-16 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-xl">
              <PlayIcon className="w-7 h-7" />
            </span>
            <span className="absolute top-4 left-4 text-[11px] font-semibold text-white bg-black/40 px-2 py-1 rounded-md">
              Student Render
            </span>
            <span className="absolute bottom-4 right-4 text-[11px] font-semibold text-white bg-black/40 px-2 py-1 rounded-md">
              00:12
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-6">
            {demoFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-charcoal border border-white/10 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{title}</h3>
                <p className="font-body text-sm text-white/50 mb-4">{desc}</p>
                <Link to="/courses" aria-label={title} className="flex justify-center text-primary hover:opacity-80 transition-opacity">
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="inline-block text-xs font-semibold text-primary bg-white/10 px-4 py-1.5 rounded-full mb-5">
            Live Demo
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-white mb-5">
            See <span className="text-primary">Reelwise</span> in Action
          </h2>
          <p className="font-body text-white/60 mb-4">
            Not sure AI video is for you? Watch what students build in week one.
          </p>
          <p className="font-body text-white/60 mb-8">
            Explore real student renders and prompt breakdowns to see exactly how a short prompt becomes a
            finished cinematic clip.
          </p>

          <div className="relative rounded-2xl border border-white/10 bg-charcoal aspect-[4/3] overflow-hidden p-5 flex flex-col">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span className="ml-2 font-body text-xs text-white/40">prompt_console.ai</span>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="h-2.5 w-5/6 rounded-full bg-white/10" />
              <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
              <div className="h-2.5 w-4/5 rounded-full bg-primary/40" />
              <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-body text-xs text-white/40">Rendering…</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full">
                <SparkleIcon className="w-3.5 h-3.5" />
                Generate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PlusMinusIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M5 12h14" strokeLinecap="round" />
    {!open && <path d="M12 5v14" strokeLinecap="round" />}
  </svg>
);

const faqs = [
  {
    question: "What types of courses do you offer?",
    answer:
      "We teach text-to-video, image-to-video, and AI-assisted editing using tools like Runway, Sora, Pika, and Kling — plus prompt engineering, storyboarding, and post-production.",
  },
  {
    question: "Are your courses beginner-friendly?",
    answer:
      "Yes. No filmmaking or coding background needed — lessons start with prompt basics and build up to full cinematic sequences.",
  },
  {
    question: "Which AI video tools will I learn?",
    answer:
      "Runway Gen-3, OpenAI Sora, Pika, Luma Dream Machine, and Kling, along with AI-assisted editing workflows in Premiere and CapCut.",
  },
  {
    question: "Do I need my own AI subscriptions to practice?",
    answer:
      "No. Every course includes generation credits for the tools we teach, so you can render real clips without buying separate subscriptions.",
  },
  {
    question: "How can I access the courses?",
    answer:
      "Once you sign up, every course, lesson, and downloadable prompt library is available from your dashboard on any device.",
  },
  {
    question: "Can I preview a course before enrolling?",
    answer:
      "Yes, a free sample lesson and prompt challenge are available so you can try Reelwise before committing to a full course.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="relative overflow-hidden bg-white">
      <img
        src={RabbitPurple}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute left-0 bg-blend-color-burn bottom-20 w-40 lg:w-48 opacity-80 pointer-events-none select-none"
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-sm font-semibold text-primary bg-white px-4 py-1.5 rounded-full mb-5">
          FAQs
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-ink mb-4">
          Common Questions, <span className="text-primary">Quick Answers</span>
        </h2>
        <p className="font-body text-brand-muted mb-10">
          Find answers to your most pressing questions about Reelwise and our AI video courses.
        </p>

        <div className="flex flex-col gap-4 text-left">
          {faqs.map(({ question, answer }, i) => {
            const open = openIndex === i;
            return (
              <div
                key={question}
                className={`rounded-2xl border transition-colors ${open ? "bg-white border-primary/20" : "bg-white/60 border-transparent"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${open ? "bg-primary text-white" : "bg-lavender text-primary"
                      }`}
                  >
                    <PlusMinusIcon open={open} />
                  </span>
                  <span className="font-heading font-bold text-ink">{question}</span>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="font-body text-sm text-brand-muted px-6 pb-5 pl-[4.5rem]">{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-body text-sm text-brand-muted mt-10">
          If you have a question that isn't covered here, feel free to{" "}
          {/* No /contact route yet — wire this to a contact page or support email once one exists */}
          <span className="font-semibold text-primary underline">contact us</span> directly
        </p>
      </div>
    </section>
  );
};

const steps = [
  {
    number: "01",
    img: first,
    title: "Pick Your Track",
    desc: "Start with Text-to-Video, Image-to-Video, or AI Editing — choose the track that matches the content you want to create.",
  },
  {
    number: "02",
    img: second,
    title: "Prompt & Generate",
    desc: "Follow short, expert-led lessons and generate real clips inside every module using live model credits.",
  },
  {
    number: "03",
    img: third,
    title: "Ship Your Reel",
    desc: "Edit, grade, and publish a finished project for your portfolio, then get instructor feedback to level up.",
  },
];

const ProcessSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div
      className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
      style={primaryGlowStyle}
      aria-hidden="true"
    />

    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div>
          <span className="inline-block text-sm font-semibold text-primary bg-lavender/70 px-4 py-1.5 rounded-full mb-5">
            Our Process
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-ink mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="font-body text-brand-muted mb-8 max-w-md">
            From your first prompt to a finished trailer — see how creators go from zero to a shipped reel in
            three steps.
          </p>

          <div className="relative rounded-2xl border-2 border-primary/70 bg-white aspect-[3/2] overflow-hidden p-2">
            <div className="grid grid-cols-3 gap-2 h-full">
              {[
                first,
                second,
                third,
              ].map((img, i) => (
                <div
                  key={img}
                  className="relative rounded-lg overflow-hidden"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold text-white bg-black/30 rounded-xl px-1">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-5">
            {steps.map(({ img, number, title, desc }) => (
              <div
                key={number}
                className="bg-lavender/60 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6"
              >
                <div className="sm:w-40 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-royal-purple text-white font-heading font-bold flex items-center justify-center mb-3">
                    {number}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-ink leading-snug">{title}</h3>
                </div>
                <div className="hidden sm:block w-px bg-ink/10 self-stretch" aria-hidden="true" />
                <p className="font-body text-sm text-brand-muted flex-1">{desc}</p>
              </div>
            ))}
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 font-body font-semibold text-primary mt-6 hover:opacity-80 transition-opacity"
          >
            Get Started Today
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Hero = () => {
  const { isAuthenticated, user } = useAuth();
  const [totalCourses, setTotalCourses] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCourses({ limit: 1 })
      .then((data) => {
        if (!cancelled) setTotalCourses(data.pagination?.totalCourses ?? null);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-t from-lavender/70 to-white   px-2 md:pt-7 pb-15">
      <img
        src={Rabbit}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute translate-x-[100%] translate-y-[20%] w-[420px] h-[420px] opacity-[0.05] pointer-events-none"
      />

      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 py-0 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-white px-4 py-1.5 rounded-full mb-5">
            <SparkleIcon className="w-3.5 h-3.5" />
            The Future of Filmmaking
          </span>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl leading-[1.1] mb-5">
            {isAuthenticated ? (
              <span className="text-ink">Welcome back, {user?.name?.split(" ")[0] || "there"}</span>
            ) : (
              <>
                <span className="block text-ink">Turn Simple Prompts</span>
                <span className="block text-primary">Into Cinematic Video</span>
                <span className="block text-ink">In Minutes</span>
              </>
            )}
          </h1>

          <p className="font-body text-brand-muted text-lg mb-8 max-w-md">
            Hands-on courses that teach you to prompt, direct, and edit with Runway, Sora, Pika, and Kling — no
            film degree, no crew, no code required.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-primary to-royal-purple hover:opacity-90 transition-opacity"
            >
              Explore Courses
              <ArrowIcon />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signup"
                className="px-6 py-3 rounded-full bg-white font-semibold text-ink border border-black/10 hover:border-black/20 transition-colors"
              >
                Start Creating Free
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[filler_one, filler_two, filler_three, filler_four].map((c, i) => (
                <img
                  key={i}
                  src={c}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border-2 border-white"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="font-body text-sm text-brand-muted">Join 12,000+ AI creators worldwide</p>
          </div>
        </div>

        <div className="relative">
          {/* Dot-grid accent behind the image, bulging past its right edge */}
          <div
            className="block absolute -right-6 lg:-right-15 top-[3%] bottom-[3%] w-4/5"
            style={dotGridStyle}
            aria-hidden="true"
          />

          {/* Placeholder for a real photo/render — swap in a real asset when available */}
          <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-br from-lavender via-white to-primary/10 aspect-[24/23] overflow-hidden flex items-center justify-center">
            <img src={herosectionimage} alt="Hero Section" />
          </div>

          <div className="absolute bottom-6 -right-4 sm:right-4 bg-white rounded-xl shadow-lg px-5 py-4 max-w-[220px]">
            <p className="font-heading font-bold text-2xl text-ink">
              {totalCourses !== null ? `${totalCourses}+` : "—"}
            </p>
            <p className="font-body text-sm font-semibold text-ink/80 mb-1">AI Video Courses</p>
            <StarRow />
          </div>
        </div>
      </div>
    </section>
  );
};

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const avatarPositions = [
  "left-0 top-7 w-20 h-20",
  "left-[16%] top-5 w-20 h-28",
  "left-[9%] top-[38%] w-24 h-24",
  "left-0 top-[70%] w-28 h-28",
  "left-[18%] top-[72%] w-24 h-24",
  "right-0 top-7 w-20 h-20",
  "right-[14%] top-5 w-24 h-28",
  "right-[7%] top-[38%] w-24 h-28",
  "right-[16%] top-[70%] w-20 h-20",
  "right-0 top-[64%] w-24 h-28",
];

// High-quality stock images representing AI, filmmaking, and video editing
const stockImages = [
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80", // AI / Robot
  "https://images.unsplash.com/photo-1581609784724-68d753c36494?auto=format&fit=crop&w=300&q=80", // Film Camera
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80", // Tech Render
  "https://images.unsplash.com/photo-1643083978988-9e157ebca7a6?auto=format&fit=crop&w=300&q=80", // AI Artificial Nature
  "https://images.unsplash.com/photo-1635310568932-47fd9c961c26?auto=format&fit=crop&w=300&q=80", // Video Editing Laptop
  "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=300&q=80", // Creative Sketching
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80", // Modern Workspace
  "https://images.unsplash.com/photo-1657788913374-11f55e6afefe?auto=format&fit=crop&w=300&q=80", // Software UI
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=300&q=80", // Abstract Creative
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=300&q=80", // AI Tech Processing
];

const CtaSection = () => (
  <section className="relative overflow-hidden bg-lavender/70 py-20 sm:py-28">
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-10 pointer-events-none"
      style={primaryGlowStyle}
      aria-hidden="true"
    />

    <div
      className="hidden lg:block absolute inset-0 max-w-6xl mx-auto px-6 pointer-events-none select-none"
      aria-hidden="true"
    >
      {avatarPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute rounded-2xl bg-white shadow-md border border-black/5 flex items-center justify-center overflow-hidden ${pos}`}
        >
          <img
            src={stockImages[i]}
            alt={`AI Video Generation Concept ${i + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>

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
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-primary hover:opacity-90 transition-opacity"
      >
        View All Courses
        <ArrowIcon />
      </Link>
    </div>
  </section>
);

const Landing = () => {
  return (
    <div>
      <Hero />
      <ImpactSection />
      <ProcessSection />
      <SubjectsSection />
      {/* <DemoSection /> */}
      <FaqSection />
      <CtaSection />
      <ContinueLearningSection />
    </div>
  );
};

export default Landing;
