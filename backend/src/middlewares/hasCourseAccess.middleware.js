import mongoose from "mongoose";
import { Content } from "../models/content.model.js";
import { Purchase } from "../models/purchase.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Run after verifyJwt. Guards the single "give me the real content payload"
// route: allow if the content is demo-flagged, the requester is an ADMIN, or
// the requester has a COMPLETED purchase for the content's course.
export const hasCourseAccess = asyncHandler(async (req, res, next) => {
  const { contentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ApiError(400, "Invalid content id");
  }

  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  if (content.isDemo || req.user.role === "ADMIN") {
    req.content = content;
    return next();
  }

  const purchase = await Purchase.findOne({
    user: req.user._id,
    course: content.course,
    status: "COMPLETED",
  });

  if (!purchase) {
    throw new ApiError(403, "Purchase required to access this content");
  }

  req.content = content;
  next();
});
