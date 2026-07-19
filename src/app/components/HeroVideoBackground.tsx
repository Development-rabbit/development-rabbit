"use client";

import { useEffect, useRef, useState } from "react";

const VIDEOS = ["/vid1.mp4", "/vid2.mp4"];

export default function HeroVideoBackground() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Whenever the active video changes, rewind + play it and pause the other.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      {/* Full-screen videos — play one at a time, crossfade, loop forever */}
      {VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay={i === 0}
          muted
          playsInline
          preload="auto"
          onEnded={() => setActive((i + 1) % VIDEOS.length)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === active ? "opacity-45" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

      {/* Accent glows */}
      <div className="absolute top-1/4 right-1/4 w-[320px] md:w-[500px] h-[320px] md:h-[500px] bg-accent-purple/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[260px] md:w-[400px] h-[260px] md:h-[400px] bg-accent-blue/15 rounded-full blur-[130px] pointer-events-none" />
    </div>
  );
}
