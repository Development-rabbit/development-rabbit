import mongoose from "mongoose";

// Base schema shared by every content type inside a module. The concrete
// shape (video/note/quiz) is added via discriminators below so type-specific
// required fields are validated without hand-rolled conditional logic, and
// reads auto-hydrate the correct subclass (VideoContent/NoteContent/QuizContent).
const contentSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    // Denormalized from module.course at creation time (server-derived only,
    // never trust a client-supplied value) so access/list queries don't need
    // to join through Module.
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
    thumbnail: {
      type: String, // Bunny Storage url
    },
    // Position of this content item within its module, set/edited by the admin
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Demo-flagged content is viewable without purchasing the course
    isDemo: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, discriminatorKey: "type" }
);

contentSchema.index({ module: 1, order: 1 });
contentSchema.index({ course: 1, isDemo: 1 });
contentSchema.index({ module: 1, createdAt: -1 });

export const Content = mongoose.model("Content", contentSchema);

export const VideoContent = Content.discriminator(
  "video",
  new mongoose.Schema({
    videoUrl: {
      type: String, // Bunny Stream HLS playback url (or a manually-pasted external url)
      // Not required at the schema level: a video stuck in "pending"/"failed"
      // upload state has no playable url yet.
      required: function () {
        return this.uploadStatus === "ready";
      },
    },
    duration: {
      // seconds
      type: Number,
      required: true,
    },
    // Bunny Stream video guid — needed to retry/replace/delete the video on Bunny.
    bunnyVideoId: {
      type: String,
    },
    // "ready": videoUrl is playable. "pending": upload in flight (shouldn't
    // persist past the request that set it). "failed": the Bunny upload was
    // rejected and a copy of the file is sitting in tempFilePath for retry.
    uploadStatus: {
      type: String,
      enum: ["ready", "pending", "failed"],
      default: "ready",
    },
    // Local path of the temp file kept around after a failed Bunny upload
    // so the admin can retry without re-uploading from the browser. Cleared
    // once the upload succeeds (and the file is deleted).
    tempFilePath: {
      type: String,
    },
  })
);

export const NoteContent = Content.discriminator(
  "note",
  new mongoose.Schema({
    body: {
      type: String,
      default: "",
    },
    attachmentUrl: {
      type: String, // optional downloadable Bunny Storage asset
    },
    attachmentName: {
      type: String,
    },
  })
);

export const QuizContent = Content.discriminator(
  "quiz",
  new mongoose.Schema({
    questions: [
      {
        questionText: { type: String, required: true, trim: true },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: (options) => Array.isArray(options) && options.length >= 2,
            message: "A quiz question needs at least 2 options",
          },
        },
        correctOptionIndex: {
          type: Number,
          required: true,
          min: 0,
        },
        explanation: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],
  })
);
