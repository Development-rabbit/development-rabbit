import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // Position of this module within its course, set/edited by the admin
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

moduleSchema.index({ course: 1, order: 1 });
moduleSchema.index({ course: 1, createdAt: -1 });

export const Module = mongoose.model("Module", moduleSchema);
