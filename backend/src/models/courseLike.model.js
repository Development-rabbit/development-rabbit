import mongoose from "mongoose";

// Dedicated model rather than reusing the existing Like model, whose
// likedTo is hardcoded ref:"Post" — matches the repo's existing pattern of
// one small model per relation type (Follow vs Like vs Share are separate).
const courseLikeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

courseLikeSchema.index({ likedBy: 1, course: 1 }, { unique: true });
courseLikeSchema.index({ course: 1, createdAt: -1 });

export const CourseLike = mongoose.model("CourseLike", courseLikeSchema);
