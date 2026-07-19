"use client";

import dynamic from "next/dynamic";

const FloatingWaves = dynamic(() => import("./FloatingWaves"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] animate-pulse bg-white/5 rounded-3xl" />
  ),
});

export default function DynamicHeroScene() {
  return <FloatingWaves />;
}
