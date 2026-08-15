import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { Module } from "../models/module.model.js";
import { Content } from "../models/content.model.js";

// Validates {items:[{id, order}, ...]} and that every id belongs to the
// given parent (courseId for modules, moduleId for content). Shared shape
// used by both reorderModules and content.controller.js#reorderContent.
export const parseReorderItems = (body) => {
  const items = body?.items;
  if (!Array.isArray(items) || !items.length) {
    throw new ApiError(400, "items must be a non-empty array of {id, order}");
  }
  for (const item of items) {
    if (!item?.id || !mongoose.Types.ObjectId.isValid(item.id) || typeof item.order !== "number") {
      throw new ApiError(400, "Each item requires a valid id and a numeric order");
    }
  }
  return items;
};

// Create a module inside a course
export const createModule = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description = "", order } = req.body;

  if (!title?.trim()) throw new ApiError(400, "Title is required");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  let resolvedOrder = order;
  if (resolvedOrder === undefined) {
    resolvedOrder = await Module.countDocuments({ course: courseId });
  }

  const module_ = await Module.create({
    course: courseId,
    title: title.trim(),
    description: description.trim(),
    order: resolvedOrder,
  });

  res.status(201).json(new ApiResponse(201, module_, "Module created successfully"));
});

// Update a module's title/description/order
export const updateModule = asyncHandler(async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, description, order } = req.body;

  const module_ = await Module.findOne({ _id: moduleId, course: courseId });
  if (!module_) throw new ApiError(404, "Module not found");

  if (title?.trim()) module_.title = title.trim();
  if (description !== undefined) module_.description = description.trim();
  if (order !== undefined) module_.order = Number(order);

  await module_.save();

  res.json(new ApiResponse(200, module_, "Module updated successfully"));
});

// Delete a module and cascade its content
export const deleteModule = asyncHandler(async (req, res) => {
  const { courseId, moduleId } = req.params;

  const module_ = await Module.findOne({ _id: moduleId, course: courseId });
  if (!module_) throw new ApiError(404, "Module not found");

  await Content.deleteMany({ module: moduleId });
  await Module.findByIdAndDelete(moduleId);

  res.json(new ApiResponse(200, null, "Module deleted successfully"));
});

// List modules for a course (structure only — no nested content payloads;
// use getCourseDetail for the combined course+modules+content view)
export const getModules = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const modules = await Module.find({ course: courseId }).sort({ order: 1 });

  res.json(new ApiResponse(200, modules, "Modules fetched successfully"));
});

// Bulk reorder modules within a course
export const reorderModules = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const items = parseReorderItems(req.body);

  const existingIds = new Set(
    (await Module.find({ course: courseId }).select("_id")).map((m) => m._id.toString())
  );
  for (const item of items) {
    if (!existingIds.has(item.id)) {
      throw new ApiError(400, `Module ${item.id} does not belong to this course`);
    }
  }

  await Module.bulkWrite(
    items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id, course: courseId }, update: { $set: { order } } },
    }))
  );

  const modules = await Module.find({ course: courseId }).sort({ order: 1 });

  res.json(new ApiResponse(200, modules, "Modules reordered successfully"));
});
