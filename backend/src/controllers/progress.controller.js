import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Progress } from "../models/progress.model.js";
import { Content } from "../models/content.model.js";
import { Module } from "../models/module.model.js";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";

const COMPLETION_THRESHOLD = 0.9;

// Record a video watch-position heartbeat. req.content/req.user come from
// the hasCourseAccess middleware, which already enforced demo/admin/purchase
// access for this content — reused rather than re-derived here.
export const reportVideoProgress = asyncHandler(async (req, res) => {
  const content = req.content;
  const { positionSeconds } = req.body;

  if (content.type !== "video") {
    throw new ApiError(400, "Progress heartbeats only apply to video content");
  }
  if (typeof positionSeconds !== "number" || !Number.isFinite(positionSeconds) || positionSeconds < 0) {
    throw new ApiError(400, "positionSeconds must be a non-negative number");
  }

  const duration = content.duration || 0;
  const clamped = duration > 0 ? Math.min(positionSeconds, duration) : positionSeconds;
  const now = new Date();

  let progress = await Progress.findOneAndUpdate(
    { user: req.user._id, content: content._id },
    {
      $setOnInsert: {
        user: req.user._id,
        content: content._id,
        course: content.course,
        type: content.type,
        firstViewedAt: now,
      },
      $set: { lastPositionSeconds: clamped, lastAccessedAt: now },
      $max: { maxWatchedSeconds: clamped },
    },
    { upsert: true, new: true }
  );

  if (!progress.isCompleted && duration > 0 && progress.maxWatchedSeconds / duration >= COMPLETION_THRESHOLD) {
    // Filtered on isCompleted:false so overlapping requests only set completedAt once.
    await Progress.updateOne(
      { _id: progress._id, isCompleted: false },
      { $set: { isCompleted: true, completedAt: now } }
    );
    progress.isCompleted = true;
  }

  res.json(
    new ApiResponse(
      200,
      {
        lastPositionSeconds: progress.lastPositionSeconds,
        maxWatchedSeconds: progress.maxWatchedSeconds,
        isCompleted: progress.isCompleted,
      },
      "Progress saved"
    )
  );
});

// First published content item of a course (module order, then content
// order) — the resume target for a course that was purchased but never opened.
const getFirstContentForCourse = async (courseId) => {
  const modules = await Module.find({ course: courseId }).sort({ order: 1 }).select("_id");
  for (const module_ of modules) {
    const content = await Content.findOne({ module: module_._id, isPublished: true })
      .sort({ order: 1 })
      .select("title type thumbnail");
    if (content) return content;
  }
  return null;
};

// Answers both "does this user have any enrolled course" (drives the
// post-login redirect) and "what should Continue Learning show" for the
// currently-authenticated user.
export const getContinueLearningDashboard = asyncHandler(async (req, res) => {
  const purchases = await Purchase.find({ user: req.user._id, status: "COMPLETED" }).select("course");

  if (!purchases.length) {
    return res.json(
      new ApiResponse(200, { hasAnyEnrollment: false, continueLearning: [] }, "Dashboard fetched")
    );
  }

  const continueLearning = [];

  for (const purchase of purchases) {
    const courseId = purchase.course;
    const totalContent = await Content.countDocuments({ course: courseId, isPublished: true });
    if (!totalContent) continue;

    const completedContent = await Progress.countDocuments({
      user: req.user._id,
      course: courseId,
      isCompleted: true,
    });
    const completionPercent = Math.round((completedContent / totalContent) * 100);
    if (completionPercent >= 100) continue;

    const mostRecent = await Progress.findOne({ user: req.user._id, course: courseId }).sort({
      lastAccessedAt: -1,
    });

    const resumeContent = mostRecent
      ? await Content.findById(mostRecent.content).select("title type thumbnail")
      : await getFirstContentForCourse(courseId);
    if (!resumeContent) continue;

    const course = await Course.findById(courseId).select("title slug thumbnail");
    if (!course) continue;

    continueLearning.push({
      course,
      totalContent,
      completedContent,
      completionPercent,
      resumeContent,
      lastAccessedAt: mostRecent?.lastAccessedAt || null,
    });
  }

  continueLearning.sort((a, b) => new Date(b.lastAccessedAt || 0) - new Date(a.lastAccessedAt || 0));

  res.json(
    new ApiResponse(200, { hasAnyEnrollment: true, continueLearning }, "Dashboard fetched")
  );
});
