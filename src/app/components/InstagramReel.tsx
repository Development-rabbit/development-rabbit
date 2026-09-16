import Script from "next/script";

const reelUrl =
  "https://www.instagram.com/reel/DdJPbzTMmxh/?utm_source=ig_embed&utm_campaign=loading";

export default function InstagramReel() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" aria-labelledby="instagram-heading">
      <div className="absolute inset-0 bg-accent-light/45 pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-center">
        <div>
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
            From our studio
          </span>
          <h2 id="instagram-heading" className="font-display text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mt-4">
            Ideas in motion. <span className="font-serif italic font-normal text-accent">See what&apos;s next.</span>
          </h2>
          <p className="mt-5 text-muted leading-relaxed max-w-md">
            A glimpse into the work, experiments, and conversations shaping Development Rabbit.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <blockquote
            className="instagram-media w-full max-w-[420px] min-w-0"
            data-instgrm-permalink={reelUrl}
            data-instgrm-version="14"
            style={{
              background: "#fff",
              border: 0,
              borderRadius: 3,
              boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: 1,
              padding: 0,
            }}
          >
            <div style={{ padding: 16, textAlign: "center" }}>
              <a href={reelUrl} target="_blank" rel="noreferrer" style={{ color: "#3897f0", textDecoration: "none" }}>
                View this post on Instagram
              </a>
            </div>
          </blockquote>
        </div>
      </div>
      <Script async src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
    </section>
  );
}