import { asyncHandler } from "../utils/asyncHandler.js";
import { VideoContent } from "../models/content.model.js";
import { getBunnyVideo, BUNNY_VIDEO_STATUS } from "../utils/bunny.js";

// Bunny Stream calls this whenever a video's encoding status changes. The
// request isn't signed, so the body is only treated as a signal to go
// re-check the video via Bunny's API (using our AccessKey) rather than
// trusted directly.
export const handleBunnyWebhook = asyncHandler(async (req, res) => {
  const { VideoLibraryId, VideoGuid } = req.body || {};

  // Always ack quickly so Bunny doesn't keep retrying — errors here are
  // logged, not surfaced, since there's no client waiting on this request.
  if (!VideoGuid || String(VideoLibraryId) !== process.env.BUNNY_STREAM_LIBRARY_ID) {
    return res.status(200).json({ received: true });
  }

  const content = await VideoContent.findOne({ bunnyVideoId: VideoGuid });
  if (!content) return res.status(200).json({ received: true });

  try {
    const video = await getBunnyVideo(VideoGuid);

    if (video.status === BUNNY_VIDEO_STATUS.FINISHED) {
      if (video.length > 0) content.duration = video.length;
      content.uploadStatus = "ready";
      await content.save();
    } else if (
      video.status === BUNNY_VIDEO_STATUS.ERROR ||
      video.status === BUNNY_VIDEO_STATUS.UPLOAD_FAILED
    ) {
      // Encoding failed after the upload itself already succeeded — the temp
      // file is long gone by this point, so recovery is a fresh re-upload
      // from the browser rather than the tempFilePath-based retry endpoint.
      content.uploadStatus = "failed";
      await content.save();
    }
  } catch (error) {
    console.error("Bunny webhook processing failed:", error.message);
  }

  res.status(200).json({ received: true });
});
