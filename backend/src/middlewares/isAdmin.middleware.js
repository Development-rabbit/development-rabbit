import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Run after verifyJwt — req.user must already be populated.
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new ApiError(403, "Admin access required");
  }
  next();
});
