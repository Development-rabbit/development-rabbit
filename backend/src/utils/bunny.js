import axios from "axios";
import fs from "fs";

const BASE_URL = "https://video.bunnycdn.com/library";

const libraryId = () => process.env.BUNNY_STREAM_LIBRARY_ID;
const apiKey = () => process.env.BUNNY_STREAM_API_KEY;
const cdnHostname = () => process.env.BUNNY_STREAM_CDN_HOSTNAME;

const bunnyClient = () => {
  if (!libraryId() || !apiKey() || !cdnHostname()) {
    throw new Error(
      "Bunny Stream is not configured — set BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_API_KEY, BUNNY_STREAM_CDN_HOSTNAME"
    );
  }
  return axios.create({
    baseURL: `${BASE_URL}/${libraryId()}`,
    headers: { AccessKey: apiKey(), accept: "application/json" },
  });
};

const createBunnyVideo = async (title) => {
  const { data } = await bunnyClient().post("/videos", { title });
  return data.guid;
};

const uploadBunnyVideoFile = async (videoId, filePath) => {
  const { size } = fs.statSync(filePath);
  await bunnyClient().put(`/videos/${videoId}`, fs.createReadStream(filePath), {
    headers: { "Content-Type": "application/octet-stream", "Content-Length": size },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
};

export const deleteBunnyVideo = async (videoId) => {
  if (!videoId) return;
  await bunnyClient().delete(`/videos/${videoId}`);
};

// Bunny's status-change webhook is unauthenticated (no signature), so it's
// only ever used as a "go check now" nudge — callers re-fetch the video
// object here to get the real status/length rather than trusting the
// webhook body.
export const getBunnyVideo = async (videoId) => {
  const { data } = await bunnyClient().get(`/videos/${videoId}`);
  return data;
};

// Bunny Stream video.Status values (see library webhook docs).
export const BUNNY_VIDEO_STATUS = {
  CREATED: 0,
  UPLOADED: 1,
  PROCESSING: 2,
  TRANSCODING: 3,
  FINISHED: 4,
  ERROR: 5,
  UPLOAD_FAILED: 6,
};

export const getBunnyPlaybackUrls = (videoId) => ({
  playbackUrl: `https://${cdnHostname()}/${videoId}/playlist.m3u8`,
  thumbnailUrl: `https://${cdnHostname()}/${videoId}/thumbnail.jpg`,
  embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId()}/${videoId}`,
});

// Uploads a locally-stored video file to Bunny Stream. Pass existingVideoId
// to retry a previously-failed upload — it reuses that Bunny video object
// instead of creating a new (empty) one on every attempt. Throws on any
// failure; the caller is responsible for keeping the local file around so
// the upload can be retried, and for persisting error.bunnyVideoId (which
// is set once the video object exists on Bunny, even if the PUT that
// actually uploads the bytes fails).
export const uploadVideoToBunny = async ({ filePath, title, existingVideoId }) => {
  let videoId = existingVideoId;
  try {
    if (!videoId) {
      videoId = await createBunnyVideo(title);
    }
    await uploadBunnyVideoFile(videoId, filePath);
    return { videoId, ...getBunnyPlaybackUrls(videoId) };
  } catch (error) {
    error.bunnyVideoId = videoId;
    throw error;
  }
};
