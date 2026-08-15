import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["CREATED", "COMPLETED", "FAILED"],
      default: "CREATED",
    },
    // Absent for instant free-course enrollments (no Razorpay order involved)
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

purchaseSchema.index(
  { razorpayOrderId: 1 },
  { unique: true, partialFilterExpression: { razorpayOrderId: { $exists: true, $type: "string" } } }
);
purchaseSchema.index({ user: 1, course: 1, status: 1 });
// Prevent two completed purchases of the same course by the same user, while
// still allowing multiple CREATED/FAILED attempts to coexist. Same partial-
// unique-index pattern user.model.js uses for (authProvider, providerId).
purchaseSchema.index(
  { user: 1, course: 1 },
  { unique: true, partialFilterExpression: { status: "COMPLETED" } }
);

export const Purchase = mongoose.model("Purchase", purchaseSchema);
