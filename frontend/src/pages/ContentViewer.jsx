import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "plyr/dist/plyr.css";
import { getContent } from "../api/courses";
import { reportVideoProgress } from "../api/progress";

// Throttle window for timeupdate-driven heartbeats — timeupdate fires several
// times a second, we don't want to hit the API that often.
const PROGRESS_REPORT_INTERVAL_MS = 10000;
// Don't bother seeking to a resume point that's basically the start or the
// very end of the video.
const RESUME_EDGE_THRESHOLD = 5;

const ContentViewer = () => {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoUnsupported, setVideoUnsupported] = useState(false);
  const [resumedFrom, setResumedFrom] = useState(null);

  const videoRef = useRef(null);
  const lastReportedAtRef = useRef(0);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");
      setVideoUnsupported(false);
      setResumedFrom(null);
      try {
        const data = await getContent(contentId);
        if (!cancelled) setContent(data);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Could not load this content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  useEffect(() => {
    if (content?.type !== "video" || !videoRef.current) return;

    const video = videoRef.current;
    const activeContentId = contentId;
    const resumeAt = content.progress?.lastPositionSeconds || 0;
    let hls;
    let player;
    let cancelled = false;

    const seekToResumePoint = () => {
      const withinRange = !video.duration || resumeAt < video.duration - RESUME_EDGE_THRESHOLD;
      if (resumeAt > RESUME_EDGE_THRESHOLD && withinRange) {
        video.currentTime = resumeAt;
        setResumedFrom(resumeAt);
      }
    };

    // Plyr just skins the native <video> element's controls — the
    // underlying element is still what hls.js/native HLS actually plays
    // through, so it can be initialized independently of which of those two
    // paths below ends up loading the source.
    const initPlyr = async () => {
      const { default: Plyr } = await import("plyr");
      if (!cancelled) player = new Plyr(video);
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari plays HLS natively — no hls.js needed.
      video.src = content.videoUrl;
      video.addEventListener("loadedmetadata", seekToResumePoint, { once: true });
      initPlyr();
    } else {
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          hls = new Hls({
            // Tells hls.js to prioritize fragments around this timestamp
            // from the start, rather than fetching from 0 and relying
            // solely on a currentTime assignment after the fact.
            startPosition: resumeAt > RESUME_EDGE_THRESHOLD ? resumeAt : -1,
          });
          hls.loadSource(content.videoUrl);
          hls.attachMedia(video);
          hls.once(Hls.Events.MANIFEST_PARSED, seekToResumePoint);
          initPlyr();
        } else {
          setVideoUnsupported(true);
        }
      });
    }

    const handleTimeUpdate = () => {
      currentTimeRef.current = video.currentTime;
      const now = Date.now();
      if (now - lastReportedAtRef.current >= PROGRESS_REPORT_INTERVAL_MS) {
        lastReportedAtRef.current = now;
        reportVideoProgress(activeContentId, Math.floor(video.currentTime)).catch(() => {});
      }
    };
    const handlePause = () => {
      currentTimeRef.current = video.currentTime;
      reportVideoProgress(activeContentId, Math.floor(video.currentTime)).catch(() => {});
    };
    const handleVisibilityChange = () => {
      if (document.hidden && currentTimeRef.current > 0) {
        reportVideoProgress(activeContentId, Math.floor(currentTimeRef.current)).catch(() => {});
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", seekToResumePoint);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      player?.destroy();
      hls?.destroy();
      if (currentTimeRef.current > 0) {
        reportVideoProgress(activeContentId, Math.floor(currentTimeRef.current)).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content?.videoUrl]);

  if (loading)
    return <div className="max-w-6xl mx-auto px-4 py-16 font-body text-brand-muted">Loading…</div>;
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <p className="font-body text-red-600 mb-4">{error}</p>
        <Link to="/courses" className="font-body text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to={`/courses/${content.course}`}
          className="font-body text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          ← Back to course
        </Link>

        <div className="max-w-4xl">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink mt-4 mb-2">{content.title}</h1>
          {content.description && (
            <p className="font-body text-brand-muted mb-6">{content.description}</p>
          )}

          {content.type === "video" && (
            <>
              {videoUnsupported ? (
                <div className="w-full rounded-2xl bg-lavender/50 aspect-video mb-4 flex items-center justify-center text-sm font-body text-brand-muted px-6 text-center">
                  Video playback isn't supported in this browser. Try a recent version of Chrome, Firefox, Edge, or
                  Safari.
                </div>
              ) : (
                <video ref={videoRef} playsInline className="w-full rounded-2xl bg-black aspect-video mb-1" />
              )}
              {resumedFrom !== null && (
                <p className="font-body text-xs text-brand-muted mb-4">
                  Resumed from {Math.floor(resumedFrom / 60)}:{String(Math.floor(resumedFrom % 60)).padStart(2, "0")}
                </p>
              )}
            </>
          )}

          {content.type === "note" && (
            <div>
              <p className="font-body whitespace-pre-line text-ink/80">{content.body}</p>
              {content.attachmentUrl && (
                <a
                  href={content.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 font-body text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  📎 Download {content.attachmentName || "attachment"}
                </a>
              )}
            </div>
          )}

          {content.type === "quiz" && (
            <div className="flex flex-col gap-5">
              {content.questions?.map((q, i) => (
                <div key={i} className="border border-ink/10 rounded-2xl p-5">
                  <p className="font-heading font-bold text-ink mb-3">
                    {i + 1}. {q.questionText}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {q.options.map((opt, j) => (
                      <li
                        key={j}
                        className={`px-3 py-2 rounded-xl text-sm font-body border ${
                          j === q.correctOptionIndex
                            ? "border-green-300 bg-green-50 text-green-800"
                            : "border-ink/10 text-ink/70"
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <p className="font-body text-sm text-brand-muted mt-3">{q.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;
