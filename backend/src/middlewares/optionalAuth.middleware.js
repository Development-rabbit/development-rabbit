import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Same token-decode logic as verifyJwt, but never throws — sets req.user
// when a valid token is present, otherwise leaves it undefined and continues.
// Used on public browsing routes that still want to personalize the response
// (isLikedByUser/isEnrolled) for logged-in visitors.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return next();
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Invalid/expired token on an optional route — proceed as anonymous
  }

  next();
});
