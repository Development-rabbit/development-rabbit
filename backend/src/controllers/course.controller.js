import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnBunnyStorage } from "../utils/bunnyStorage.js";
import { Course } from "../models/course.model.js";
import { Module } from "../models/module.model.js";
import { Content } from "../models/content.model.js";
import { CourseReview } from "../models/courseReview.model.js";
import { CourseLike } from "../models/courseLike.model.js";
import { Purchase } from "../models/purchase.model.js";

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const generateUniqueSlug = async (title) => {
  const base = slugify(title) || "course";
  let slug = base;
  let suffix = 1;
  while (await Course.exists({ slug })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

const parseTags = (tags, fallback = []) => {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string" && tags.trim()) {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return fallback;
};

const recomputeCourseRating = async (courseId) => {
  const stats = await CourseReview.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const { avgRating = 0, count = 0 } = stats[0] || {};

  await Course.findByIdAndUpdate(courseId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewsCount: count,
  });
};

// Adds isLikedByUser/isEnrolled $lookup+$addFields stages scoped to req.user,
// or static false defaults for anonymous requests. Shared by getCourses and
// getCourseDetail so both compute these fields identically.
const withUserContextStages = (userId) => {
  if (!userId) {
    return [{ $addFields: { isLikedByUser: false, isEnrolled: false } }];
  }

  const uid = new mongoose.Types.ObjectId(userId);

  return [
    {
      $lookup: {
        from: "courselikes",
        let: { courseId: "$_id" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$course", "$$courseId"] }, { $eq: ["$likedBy", uid] }] } } },
        ],
        as: "userLike",
      },
    },
    {
      $lookup: {
        from: "purchases",
        let: { courseId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$course", "$$courseId"] },
                  { $eq: ["$user", uid] },
                  { $eq: ["$status", "COMPLETED"] },
                ],
              },
            },
          },
        ],
        as: "userPurchase",
      },
    },
    {
      $addFields: {
        isLikedByUser: { $gt: [{ $size: "$userLike" }, 0] },
        isEnrolled: { $gt: [{ $size: "$userPurchase" }, 0] },
      },
    },
    { $project: { userLike: 0, userPurchase: 0 } },
  ];
};

// Adds isViewed/isCompleted/watchedSeconds to each content item, scoped to
// req.user, for the getCourseDetail content sub-pipeline. Same shape as
// withUserContextStages: static false/0 defaults for anonymous requests.
const withContentProgressStages = (userId) => {
  if (!userId) {
    return [{ $addFields: { isViewed: false, isCompleted: false, watchedSeconds: 0 } }];
  }

  const uid = new mongoose.Types.ObjectId(userId);

  return [
    {
      $lookup: {
        from: "progresses",
        let: { contentId: "$_id" },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ["$content", "$$contentId"] }, { $eq: ["$user", uid] }] } } },
        ],
        as: "userProgress",
      },
    },
    {
      $addFields: {
        isViewed: { $gt: [{ $size: "$userProgress" }, 0] },
        isCompleted: { $ifNull: [{ $first: "$userProgress.isCompleted" }, false] },
        watchedSeconds: { $ifNull: [{ $first: "$userProgress.maxWatchedSeconds" }, 0] },
      },
    },
    { $project: { userProgress: 0 } },
  ];
};

// Create a new course
export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price = 0,
    currency = "INR",
    category = "other",
    level = "beginner",
    tags,
  } = req.body;

  if (!title?.trim()) throw new ApiError(400, "Title is required");
  if (!description?.trim()) throw new ApiError(400, "Description is required");

  let thumbnailUrl;
  if (req.file) {
    const uploadResult = await uploadOnBunnyStorage(req.file.path, "courses");
    if (!uploadResult) throw new ApiError(500, "Failed to upload thumbnail");
    thumbnailUrl = uploadResult.url;
  }

  const slug = await generateUniqueSlug(title.trim());

  const course = await Course.create({
    title: title.trim(),
    slug,
    description: description.trim(),
    thumbnail: thumbnailUrl,
    price: Number(price) || 0,
    currency,
    instructor: req.user._id,
    category,
    level,
    tags: parseTags(tags),
  });

  res.status(201).json(new ApiResponse(201, course, "Course created successfully"));
});

// Update an existing course (any ADMIN may edit any course)
export const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, currency, category, level, tags, isPublished } = req.body;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  if (req.file) {
    const uploadResult = await uploadOnBunnyStorage(req.file.path, "courses");
    if (!uploadResult) throw new ApiError(500, "Failed to upload thumbnail");
    course.thumbnail = uploadResult.url;
  }

  if (title?.trim()) course.title = title.trim();
  if (description !== undefined) course.description = description.trim();
  if (price !== undefined) course.price = Number(price) || 0;
  if (currency) course.currency = currency;
  if (category) course.category = category;
  if (level) course.level = level;
  if (tags !== undefined) course.tags = parseTags(tags, course.tags);
  if (isPublished !== undefined) course.isPublished = isPublished === true || isPublished === "true";

  await course.save();

  res.json(new ApiResponse(200, course, "Course updated successfully"));
});

// Delete a course — blocked once it has any completed purchase (financial
// record retention); unpublish via updateCourse instead in that case.
export const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const hasCompletedPurchase = await Purchase.exists({ course: courseId, status: "COMPLETED" });
  if (hasCompletedPurchase) {
    throw new ApiError(400, "Cannot delete a course with completed purchases — unpublish it instead");
  }

  const moduleIds = (await Module.find({ course: courseId }).select("_id")).map((m) => m._id);

  await Content.deleteMany({ module: { $in: moduleIds } });
  await Module.deleteMany({ course: courseId });
  await CourseReview.deleteMany({ course: courseId });
  await CourseLike.deleteMany({ course: courseId });
  await Course.findByIdAndDelete(courseId);

  res.json(new ApiResponse(200, null, "Course deleted successfully"));
});

// Browse/list courses with pagination and filters
export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, level, search, sortBy = "createdAt" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (req.user?.role !== "ADMIN") {
    filter.isPublished = true;
  }
  if (category && category !== "all") filter.category = category;
  if (level && level !== "all") filter.level = level;
  if (search?.trim()) {
    const term = search.trim();
    filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
      { tags: { $regex: term, $options: "i" } },
    ];
  }

  const courses = await Course.aggregate([
    { $match: filter },
    { $sort: { [sortBy]: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
        pipeline: [{ $project: { name: 1, avatar: 1, email: 1 } }],
      },
    },
    { $addFields: { instructor: { $first: "$instructor" } } },
    ...withUserContextStages(req.user?._id),
  ]);

  const totalCourses = await Course.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        courses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCourses / parseInt(limit)),
          totalCourses,
          hasNextPage: parseInt(page) < Math.ceil(totalCourses / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1,
        },
      },
      "Courses fetched successfully"
    )
  );
});

// Course detail: course metadata + ordered modules with structure-only
// content (no videoUrl/body/questions — that only ever comes back from
// GET /content/:contentId, gated by hasCourseAccess).
export const getCourseDetail = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const matchStage = mongoose.Types.ObjectId.isValid(courseId)
    ? { _id: new mongoose.Types.ObjectId(courseId) }
    : { slug: courseId };

  const courseResult = await Course.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
        pipeline: [{ $project: { name: 1, avatar: 1, email: 1 } }],
      },
    },
    { $addFields: { instructor: { $first: "$instructor" } } },
    ...withUserContextStages(req.user?._id),
  ]);

  if (!courseResult.length) throw new ApiError(404, "Course not found");
  const course = courseResult[0];

  if (!course.isPublished && req.user?.role !== "ADMIN") {
    throw new ApiError(404, "Course not found");
  }

  const isAdmin = req.user?.role === "ADMIN";
  const contentMatchExpr = isAdmin
    ? { $eq: ["$module", "$$moduleId"] }
    : { $and: [{ $eq: ["$module", "$$moduleId"] }, { $eq: ["$isPublished", true] }] };

  const modules = await Module.aggregate([
    { $match: { course: course._id } },
    { $sort: { order: 1 } },
    {
      $lookup: {
        from: "contents",
        let: { moduleId: "$_id" },
        pipeline: [
          { $match: { $expr: contentMatchExpr } },
          { $sort: { order: 1 } },
          ...withContentProgressStages(req.user?._id),
          {
            $project: {
              title: 1,
              description: 1,
              thumbnail: 1,
              order: 1,
              isDemo: 1,
              isPublished: 1,
              type: 1,
              uploadStatus: 1,
              duration: 1,
              isViewed: 1,
              isCompleted: 1,
              watchedSeconds: 1,
            },
          },
        ],
        as: "content",
      },
    },
  ]);

  res.json(new ApiResponse(200, { ...course, modules }, "Course fetched successfully"));
});

// Like/unlike a course
export const toggleCourseLike = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const existingLike = await CourseLike.findOne({ likedBy: req.user._id, course: courseId });

  if (existingLike) {
    await CourseLike.findByIdAndDelete(existingLike._id);
    await Course.findByIdAndUpdate(courseId, { $inc: { likesCount: -1 } });
    res.json(new ApiResponse(200, { isLiked: false }, "Course unliked"));
  } else {
    await CourseLike.create({ likedBy: req.user._id, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $inc: { likesCount: 1 } });
    res.json(new ApiResponse(200, { isLiked: true }, "Course liked"));
  }
});

// List reviews for a course
export const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const course = await Course.findOne(
    mongoose.Types.ObjectId.isValid(courseId) ? { _id: courseId } : { slug: courseId }
  );
  if (!course) throw new ApiError(404, "Course not found");

  const reviews = await CourseReview.aggregate([
    { $match: { course: course._id } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, avatar: 1 } }],
      },
    },
    { $addFields: { user: { $first: "$user" } } },
  ]);

  const totalReviews = await CourseReview.countDocuments({ course: course._id });

  res.json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / parseInt(limit)),
          totalReviews,
          hasNextPage: parseInt(page) < Math.ceil(totalReviews / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1,
        },
      },
      "Reviews fetched successfully"
    )
  );
});

// Create or update the requesting user's review for a course. Requires a
// completed purchase — reviews are restricted to people who actually bought
// the course.
export const addOrUpdateCourseReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment = "" } = req.body;

  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const purchase = await Purchase.findOne({ user: req.user._id, course: courseId, status: "COMPLETED" });
  if (!purchase) {
    throw new ApiError(403, "You must purchase this course before reviewing it");
  }

  const review = await CourseReview.findOneAndUpdate(
    { course: courseId, user: req.user._id },
    { rating: numericRating, comment: comment.trim() },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await recomputeCourseRating(courseId);

  res.status(201).json(new ApiResponse(201, review, "Review saved successfully"));
});

// Delete a review (owner or ADMIN)
export const deleteCourseReview = asyncHandler(async (req, res) => {
  const { courseId, reviewId } = req.params;

  const review = await CourseReview.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  await CourseReview.findByIdAndDelete(reviewId);
  await recomputeCourseRating(courseId);

  res.json(new ApiResponse(200, null, "Review deleted successfully"));
});
