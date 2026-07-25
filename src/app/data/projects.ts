export interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  href: string;
}

export const projects: Project[] = [
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
