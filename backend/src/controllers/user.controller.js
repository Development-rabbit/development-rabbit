import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnBunnyStorage } from "../utils/bunnyStorage.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Shared response shape for both local login and social login
const sendAuthResponse = async (user, res, message) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        message
      )
    );
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field || !field.trim())) {
    throw new ApiError(400, "All fields are compulsory");
  }

  const existedUser = await User.findOne({ email: email.toLowerCase() });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    authProvider: "LOCAL",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while user registeration");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (user.authProvider !== "LOCAL") {
    throw new ApiError(
      400,
      `This account uses ${user.authProvider} sign-in. Please continue with ${user.authProvider} instead.`
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  return sendAuthResponse(user, res, "User logged in successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccesToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Token not available or expired");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid or expired token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid Request");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "tokens refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (user.authProvider !== "LOCAL") {
    throw new ApiError(
      400,
      `This account signs in with ${user.authProvider} and has no password to change`
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "All fields are requiered");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { name, email } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPaths = req.file?.path;

  if (!avatarLocalPaths) {
    throw new ApiError(400, "Avatar is missing");
  }

  const avatar = await uploadOnBunnyStorage(avatarLocalPaths, "avatars");

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updatecoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar is missing");
  }

  const coverImage = await uploadOnBunnyStorage(coverImageLocalPath, "cover-images");

  if (!coverImage.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated Successfully"));
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q: searchQuery, page = 1, limit = 20 } = req.query;

  if (!searchQuery || !searchQuery.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Search query is required" });
  }

  const query = searchQuery.trim();
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const searchConditions = {
    $and: [
      { _id: { $ne: req.user._id } },
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      },
    ],
  };

  const users = await User.find(searchConditions)
    .select("name email avatar role")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ name: 1 });

  const totalUsers = await User.countDocuments(searchConditions);
  const totalPages = Math.ceil(totalUsers / parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
        },
      },
      "Users found successfully"
    )
  );
});

const getUserSuggestions = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const suggestions = await User.aggregate([
    { $match: { _id: { $ne: req.user._id } } },
    { $sample: { size: parseInt(limit) } },
    { $project: { name: 1, email: 1, avatar: 1, role: 1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, suggestions, "User suggestions fetched successfully")
    );
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId).select(
    "name email avatar role enrolledCourses"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// ---------------------------------------------------------------------------
// Social auth: find a user by (provider, providerId); if a LOCAL/other user
// already exists with that email, link the social identity onto it; else
// create a brand-new user.
// ---------------------------------------------------------------------------
const findOrCreateSocialUser = async ({
  authProvider,
  providerId,
  email,
  name,
  avatar,
}) => {
  let user = await User.findOne({ authProvider, providerId });
  if (user) return user;

  user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    user.authProvider = authProvider;
    user.providerId = providerId;
    if (!user.avatar && avatar) user.avatar = avatar;
    await user.save({ validateBeforeSave: false });
    return user;
  }

  user = await User.create({
    name,
    email,
    authProvider,
    providerId,
    avatar,
  });

  return user;
};

// POST /auth/google  { idToken }
const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google idToken is required");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google token");
  }

  if (!payload?.email) {
    throw new ApiError(400, "Google account has no accessible email");
  }

  const user = await findOrCreateSocialUser({
    authProvider: "GOOGLE",
    providerId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    avatar: payload.picture,
  });

  return sendAuthResponse(user, res, "Logged in with Google successfully");
});

// POST /auth/github  { code }  -- code from GitHub OAuth redirect
const githubLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    throw new ApiError(400, "GitHub authorization code is required");
  }

  let githubAccessToken;
  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    githubAccessToken = tokenRes.data.access_token;
  } catch (error) {
    throw new ApiError(401, "Failed to exchange GitHub authorization code");
  }

  if (!githubAccessToken) {
    throw new ApiError(401, "Invalid GitHub authorization code");
  }

  let profile, emails;
  try {
    const [profileRes, emailsRes] = await Promise.all([
      axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      }),
      axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      }),
    ]);
    profile = profileRes.data;
    emails = emailsRes.data;
  } catch (error) {
    throw new ApiError(401, "Failed to fetch GitHub profile");
  }

  const primaryEmail =
    emails.find((e) => e.primary && e.verified)?.email || emails[0]?.email;

  if (!primaryEmail) {
    throw new ApiError(400, "GitHub account has no accessible email");
  }

  const user = await findOrCreateSocialUser({
    authProvider: "GITHUB",
    providerId: String(profile.id),
    email: primaryEmail,
    name: profile.name || profile.login,
    avatar: profile.avatar_url,
  });

  return sendAuthResponse(user, res, "Logged in with GitHub successfully");
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccesToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserSuggestions,
  searchUsers,
  getUserById,
  updateUserAvatar,
  updatecoverImage,
  googleLogin,
  githubLogin,
};