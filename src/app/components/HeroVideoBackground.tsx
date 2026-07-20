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
    <div className="absolute inset-0 overflow-hidden bg-accent-panel">
      {/* Videos — play one at a time, crossfade, loop forever */}
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
            i === active ? "opacity-30" : "opacity-0"
          }`}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Blue tint — light periwinkle at the top, deep royal blue at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8a97ff]/60 via-[#3f50e6]/75 to-[#1a23a6]/90" />

      {/* Soft highlight for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_25%_0%,rgba(255,255,255,0.22),transparent)]" />
      <div className="absolute bottom-0 right-0 w-[420px] md:w-[640px] h-[420px] md:h-[640px] bg-white/10 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
}
