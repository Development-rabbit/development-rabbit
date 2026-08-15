import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnBunnyStorage } from "../utils/bunnyStorage.js";
import { uploadVideoToBunny, deleteBunnyVideo } from "../utils/bunny.js";
import { Module } from "../models/module.model.js";
import { Content, VideoContent, NoteContent, QuizContent } from "../models/content.model.js";
import { Progress } from "../models/progress.model.js";
import { parseReorderItems } from "./module.controller.js";

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === true || value === "true";
};

const parseQuestions = (questions) => {
  let parsed;
  try {
    parsed = typeof questions === "string" ? JSON.parse(questions) : questions;
  } catch (error) {
    throw new ApiError(400, "questions must be valid JSON");
  }
  if (!Array.isArray(parsed) || !parsed.length) {
    throw new ApiError(400, "questions must be a non-empty array");
  }
  return parsed;
};

const unlinkQuietly = (filePath) => {
  if (filePath) fs.unlink(filePath, () => {});
};

// Uploads a freshly-created video's local file to Bunny Stream. On success
// the temp file is deleted and the content is created "ready" to play. On
// failure (Bunny down/rejected the file) the temp file is deliberately kept
// on disk — the content is still created, but "failed", with tempFilePath
// pointing at it so an admin can hit the retry-upload endpoint later without
// re-uploading from the browser.
const createVideoContentFromUpload = async ({ base, filePath, duration }) => {
  if (!duration) throw new ApiError(400, "duration (seconds) is required for video content");

  let uploadResult;
  try {
    uploadResult = await uploadVideoToBunny({ filePath, title: base.title });
  } catch (error) {
    return VideoContent.create({
      ...base,
      duration: Number(duration),
      bunnyVideoId: error.bunnyVideoId,
      uploadStatus: "failed",
      tempFilePath: filePath,
    });
  }

  // Bunny upload succeeded — if this write fails (e.g. bad duration), the
  // temp file is left in place rather than silently orphaning the upload.
  const content = await VideoContent.create({
    ...base,
    videoUrl: uploadResult.playbackUrl,
    duration: Number(duration),
    bunnyVideoId: uploadResult.videoId,
    uploadStatus: "ready",
    // A manually-uploaded thumbnail (base.thumbnail) wins over Bunny's
    // auto-generated one.
    thumbnail: base.thumbnail || uploadResult.thumbnailUrl,
  });
  unlinkQuietly(filePath);
  return content;
};

// Same idea as createVideoContentFromUpload, but for replacing the video on
// an existing content item. On failure the previous videoUrl is left alone
// (the old video keeps playing) until a retry succeeds.
const updateVideoContentFromUpload = async (content, filePath) => {
  const previousBunnyVideoId = content.uploadStatus === "ready" ? content.bunnyVideoId : undefined;

  try {
    const result = await uploadVideoToBunny({ filePath, title: content.title });
    content.videoUrl = result.playbackUrl;
    content.bunnyVideoId = result.videoId;
    content.uploadStatus = "ready";
    content.tempFilePath = undefined;
    if (!content.thumbnail) content.thumbnail = result.thumbnailUrl;
    unlinkQuietly(filePath);
    if (previousBunnyVideoId && previousBunnyVideoId !== result.videoId) {
      deleteBunnyVideo(previousBunnyVideoId).catch(() => {});
    }
  } catch (error) {
    content.uploadStatus = "failed";
    content.bunnyVideoId = error.bunnyVideoId || content.bunnyVideoId;
    content.tempFilePath = filePath;
  }
};

// Clears out whatever a previously-failed upload left behind (temp file on
// disk, orphaned Bunny video object) when the admin overrides it with a
// manually-pasted videoUrl instead of retrying.
const discardFailedUpload = (content) => {
  if (content.uploadStatus !== "failed") return;
  unlinkQuietly(content.tempFilePath);
  if (content.bunnyVideoId) deleteBunnyVideo(content.bunnyVideoId).catch(() => {});
};

// Add a content item (video/note/quiz) to a module. Accepts optional
// uploaded files via upload.fields([{name: "media"}, {name: "thumbnail"}]):
// "media" is the video file for type "video" (uploaded to Bunny Stream) or
// a downloadable attachment for type "note" (uploaded to Bunny Storage);
// "thumbnail" is an optional cover image (uploaded to Bunny Storage) for any
// type — for video it overrides Bunny's auto-generated thumbnail. Quiz
// content takes no file; its questions arrive as a JSON body field.
export const createContent = asyncHandler(async (req, res) => {
  const { courseId, moduleId } = req.params;
  const {
    type,
    title,
    description = "",
    isDemo,
    isPublished,
    order,
    duration,
    videoUrl,
    body,
    attachmentName,
    questions,
  } = req.body;

  if (!["video", "note", "quiz"].includes(type)) {
    throw new ApiError(400, "type must be one of: video, note, quiz");
  }
  if (!title?.trim()) throw new ApiError(400, "Title is required");

  const module_ = await Module.findOne({ _id: moduleId, course: courseId });
  if (!module_) throw new ApiError(404, "Module not found");

  const resolvedOrder = order !== undefined ? Number(order) : await Content.countDocuments({ module: moduleId });

  const mediaFile = req.files?.media?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  let thumbnail;
  if (thumbnailFile) {
    const uploadResult = await uploadOnBunnyStorage(thumbnailFile.path, "content-thumbnails");
    if (!uploadResult) throw new ApiError(500, "Failed to upload thumbnail image");
    thumbnail = uploadResult.url;
  }

  const base = {
    module: moduleId,
    course: courseId,
    title: title.trim(),
    description: description.trim(),
    order: resolvedOrder,
    isDemo: toBool(isDemo, false),
    isPublished: toBool(isPublished, true),
    thumbnail,
  };

  let content;
  if (type === "video") {
    if (mediaFile) {
      content = await createVideoContentFromUpload({ base, filePath: mediaFile.path, duration });
    } else {
      if (!videoUrl) throw new ApiError(400, "A video file or videoUrl is required");
      if (!duration) throw new ApiError(400, "duration (seconds) is required for video content");
      content = await VideoContent.create({
        ...base,
        videoUrl,
        duration: Number(duration),
        uploadStatus: "ready",
      });
    }
  } else if (type === "note") {
    let mediaUrl;
    if (mediaFile) {
      const uploadResult = await uploadOnBunnyStorage(mediaFile.path, "content-attachments");
      if (!uploadResult) throw new ApiError(500, "Failed to upload media file");
      mediaUrl = uploadResult.url;
    }
    content = await NoteContent.create({
      ...base,
      body: body || "",
      attachmentUrl: mediaUrl,
      attachmentName: mediaUrl ? attachmentName || mediaFile?.originalname : undefined,
    });
  } else {
    content = await QuizContent.create({ ...base, questions: parseQuestions(questions) });
  }

  const message =
    content.type === "video" && content.uploadStatus === "failed"
      ? "Content created, but the video upload to Bunny Stream failed — retry it from the course manager."
      : "Content created successfully";
  res.status(201).json(new ApiResponse(201, content, message));
});

// Update a content item — base fields plus whichever type-specific fields
// apply to its discriminator type.
export const updateContent = asyncHandler(async (req, res) => {
  const { moduleId, contentId } = req.params;
  const { title, description, order, isDemo, isPublished, duration, videoUrl, body, attachmentName, questions } =
    req.body;

  const content = await Content.findOne({ _id: contentId, module: moduleId });
  if (!content) throw new ApiError(404, "Content not found");

  const mediaFile = req.files?.media?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  if (title?.trim()) content.title = title.trim();
  if (description !== undefined) content.description = description.trim();
  if (order !== undefined) content.order = Number(order);
  if (isDemo !== undefined) content.isDemo = toBool(isDemo);
  if (isPublished !== undefined) content.isPublished = toBool(isPublished, true);

  // Applied before the video branch below so a fresh Bunny auto-thumbnail
  // never overwrites a thumbnail the admin just uploaded in this request.
  if (thumbnailFile) {
    const uploadResult = await uploadOnBunnyStorage(thumbnailFile.path, "content-thumbnails");
    if (!uploadResult) throw new ApiError(500, "Failed to upload thumbnail image");
    content.thumbnail = uploadResult.url;
  }

  if (content.type === "video") {
    if (mediaFile) {
      await updateVideoContentFromUpload(content, mediaFile.path);
    } else if (videoUrl) {
      discardFailedUpload(content);
      content.videoUrl = videoUrl;
      content.bunnyVideoId = undefined;
      content.uploadStatus = "ready";
      content.tempFilePath = undefined;
    }
    if (duration !== undefined) content.duration = Number(duration);
  } else if (content.type === "note") {
    if (body !== undefined) content.body = body;
    if (mediaFile) {
      const uploadResult = await uploadOnBunnyStorage(mediaFile.path, "content-attachments");
      if (!uploadResult) throw new ApiError(500, "Failed to upload media file");
      content.attachmentUrl = uploadResult.url;
      content.attachmentName = attachmentName || mediaFile.originalname;
    }
  } else if (content.type === "quiz" && questions !== undefined) {
    content.questions = parseQuestions(questions);
  }

  await content.save();

  const message =
    content.type === "video" && content.uploadStatus === "failed"
      ? "Content updated, but the video upload to Bunny Stream failed — retry it from the course manager."
      : "Content updated successfully";
  res.json(new ApiResponse(200, content, message));
});

// Delete a content item
export const deleteContent = asyncHandler(async (req, res) => {
  const { moduleId, contentId } = req.params;

  const content = await Content.findOne({ _id: contentId, module: moduleId });
  if (!content) throw new ApiError(404, "Content not found");

  if (content.type === "video") {
    if (content.bunnyVideoId) deleteBunnyVideo(content.bunnyVideoId).catch(() => {});
    unlinkQuietly(content.tempFilePath);
  }

  await Content.findByIdAndDelete(contentId);

  res.json(new ApiResponse(200, null, "Content deleted successfully"));
});

// Retries a previously-failed Bunny Stream upload using the copy of the
// video that was kept on disk, without requiring the admin to re-upload the
// file from the browser.
export const retryVideoUpload = asyncHandler(async (req, res) => {
  const { moduleId, contentId } = req.params;

  const content = await Content.findOne({ _id: contentId, module: moduleId });
  if (!content) throw new ApiError(404, "Content not found");
  if (content.type !== "video") throw new ApiError(400, "Only video content can be retried");
  if (content.uploadStatus !== "failed") throw new ApiError(400, "This content has no failed upload to retry");
  if (!content.tempFilePath || !fs.existsSync(content.tempFilePath)) {
    throw new ApiError(410, "The temporary video file is no longer available — please re-upload from the browser");
  }

  try {
    const result = await uploadVideoToBunny({
      filePath: content.tempFilePath,
      title: content.title,
      existingVideoId: content.bunnyVideoId,
    });
    unlinkQuietly(content.tempFilePath);
    content.videoUrl = result.playbackUrl;
    content.bunnyVideoId = result.videoId;
    content.uploadStatus = "ready";
    content.tempFilePath = undefined;
    if (!content.thumbnail) content.thumbnail = result.thumbnailUrl;
    await content.save();
    res.json(new ApiResponse(200, content, "Video uploaded successfully"));
  } catch (error) {
    content.bunnyVideoId = error.bunnyVideoId || content.bunnyVideoId;
    await content.save();
    throw new ApiError(502, "Retry failed — Bunny Stream rejected the upload. The file is still saved; you can try again.");
  }
});

// Fetch the full content payload — gated by the hasCourseAccess middleware,
// which has already attached the correctly-typed document as req.content.
export const getContent = asyncHandler(async (req, res) => {
  const content = req.content;

  // Tracked for every authenticated user, including admins — the progress
  // heartbeat endpoint doesn't discriminate by role either, so excluding
  // admins here only meant this read always came back null for them while
  // heartbeat writes kept landing, silently breaking resume for any admin
  // account testing playback.
  let progress;
  const now = new Date();
  if (content.type === "video") {
    // Seeds a row into "recently accessed" the moment it's opened; actual
    // watch-position tracking happens via the progress heartbeat endpoint.
    progress = await Progress.findOneAndUpdate(
      { user: req.user._id, content: content._id },
      {
        $setOnInsert: {
          user: req.user._id,
          content: content._id,
          course: content.course,
          type: content.type,
          firstViewedAt: now,
        },
        $set: { lastAccessedAt: now },
      },
      { upsert: true, new: true }
    );
  } else {
    // Notes/quizzes have no partial-progress state — opening one completes it.
    progress = await Progress.findOneAndUpdate(
      { user: req.user._id, content: content._id },
      {
        $setOnInsert: {
          user: req.user._id,
          content: content._id,
          course: content.course,
          type: content.type,
          firstViewedAt: now,
          completedAt: now,
        },
        $set: { lastAccessedAt: now, isCompleted: true },
      },
      { upsert: true, new: true }
    );
  }

  res.json(
    new ApiResponse(
      200,
      {
        ...content.toObject(),
        progress: progress
          ? {
              lastPositionSeconds: progress.lastPositionSeconds,
              maxWatchedSeconds: progress.maxWatchedSeconds,
              isCompleted: progress.isCompleted,
            }
          : null,
      },
      "Content fetched successfully"
    )
  );
});

// Bulk reorder content within a module
export const reorderContent = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const items = parseReorderItems(req.body);

  const existingIds = new Set(
    (await Content.find({ module: moduleId }).select("_id")).map((c) => c._id.toString())
  );
  for (const item of items) {
    if (!existingIds.has(item.id)) {
      throw new ApiError(400, `Content ${item.id} does not belong to this module`);
    }
  }

  await Content.bulkWrite(
    items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id, module: moduleId }, update: { $set: { order } } },
    }))
  );

  const content = await Content.find({ module: moduleId }).sort({ order: 1 });

  res.json(new ApiResponse(200, content, "Content reordered successfully"));
});
