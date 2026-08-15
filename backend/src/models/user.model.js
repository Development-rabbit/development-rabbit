import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // Bunny Storage url
    },

    // ---- Multiple Auth Methods ----
    authProvider: {
      type: String,
      enum: ["LOCAL", "GOOGLE", "GITHUB"],
      default: "LOCAL",
    },
    password: {
      // only required for LOCAL accounts
      type: String,
      required: function () {
        return this.authProvider === "LOCAL";
      },
    },
    providerId: {
      // stores the Google/GitHub user id for social accounts
      type: String,
    },

    role: {
      type: String,
      enum: ["STUDENT", "ADMIN"],
      default: "STUDENT",
    },

    // ---- Purchased courses visible in dashboard ----
    enrolledCourses: [
      {
        courseId: { type: Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent two social accounts from the same provider colliding on providerId,
// while allowing many LOCAL users (who have no providerId) to coexist.
userSchema.index(
  { authProvider: 1, providerId: 1 },
  {
    unique: true,
    partialFilterExpression: { providerId: { $exists: true, $type: "string" } },
  }
);

userSchema.pre("save", async function (next) {
  // Social accounts (GOOGLE/GITHUB) don't have a local password to hash
  if (this.authProvider !== "LOCAL") return next();
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  if (this.authProvider !== "LOCAL" || !this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);