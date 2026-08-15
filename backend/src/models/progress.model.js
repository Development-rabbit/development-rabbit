import mongoose from "mongoose";

// One row per (user, content). Tracks video watch position for resume, and
// a binary viewed/not-viewed state for notes and quizzes.
const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    // Denormalized from content.course/content.type so course-scoped queries
    // (dashboard, getCourseDetail progress lookup) don't need to join through Content.
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    type: { type: String, enum: ["video", "note", "quiz"], required: true },

    isCompleted: { type: Boolean, default: false },
    // Video resume point — where playback last stopped.
    lastPositionSeconds: { type: Number, default: 0 },
    // Video furthest-ever-reached point. Completion is derived from this
    // (not lastPositionSeconds) so rewinding to rewatch never un-completes it.
    maxWatchedSeconds: { type: Number, default: 0 },

    firstViewedAt: { type: Date },
    lastAccessedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, content: 1 }, { unique: true });
// "most recently touched content in a course" — used to resolve resumeContent
progressSchema.index({ user: 1, course: 1, lastAccessedAt: -1 });
// course completion % — count of completed items in a course
progressSchema.index({ user: 1, course: 1, isCompleted: 1 });

export const Progress = mongoose.model("Progress", progressSchema);
