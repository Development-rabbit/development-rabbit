import crypto from "crypto";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getRazorpay } from "../utils/razorpay.js";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.model.js";

const grantEnrollment = async (userId, courseId) => {
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentsCount: 1 } });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { enrolledCourses: { courseId, enrolledAt: new Date() } },
  });
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

// Start a purchase. Free courses (price 0) instant-enroll without touching
// Razorpay; paid courses create a Razorpay order for the frontend to open
// checkout against.
export const initiatePurchase = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course || !course.isPublished) throw new ApiError(404, "Course not found");

  const alreadyPurchased = await Purchase.findOne({
    user: req.user._id,
    course: courseId,
    status: "COMPLETED",
  });
  if (alreadyPurchased) throw new ApiError(400, "You already have access to this course");

  if (course.price === 0) {
    const purchase = await Purchase.create({
      user: req.user._id,
      course: courseId,
      amount: 0,
      currency: course.currency,
      status: "COMPLETED",
      completedAt: new Date(),
    });

    await grantEnrollment(req.user._id, courseId);

    return res
      .status(201)
      .json(new ApiResponse(201, { instant: true, purchase }, "Enrolled successfully"));
  }

  const order = await getRazorpay().orders.create({
    amount: course.price,
    currency: course.currency,
    // Razorpay caps receipt at 40 chars — full ObjectIds don't fit, so this
    // keeps just enough of the course id plus a timestamp for traceability.
    // The actual correlation to this purchase is razorpayOrderId, stored below.
    receipt: `rcpt_${courseId.slice(-8)}_${Date.now().toString(36)}`,
  });

  await Purchase.create({
    user: req.user._id,
    course: courseId,
    amount: course.price,
    currency: course.currency,
    status: "CREATED",
    razorpayOrderId: order.id,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        instant: false,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      "Order created"
    )
  );
});

// Verify a completed Razorpay checkout and grant access on success.
export const verifyPurchase = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "razorpay_order_id, razorpay_payment_id and razorpay_signature are required");
  }

  const purchase = await Purchase.findOne({
    user: req.user._id,
    course: courseId,
    razorpayOrderId: razorpay_order_id,
    status: "CREATED",
  });
  if (!purchase) throw new ApiError(404, "No pending purchase found for this order");

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  if (!isValid) {
    purchase.status = "FAILED";
    await purchase.save();
    throw new ApiError(400, "Payment verification failed");
  }

  purchase.status = "COMPLETED";
  purchase.razorpayPaymentId = razorpay_payment_id;
  purchase.razorpaySignature = razorpay_signature;
  purchase.completedAt = new Date();
  await purchase.save();

  await grantEnrollment(req.user._id, courseId);

  res.json(new ApiResponse(200, purchase, "Payment verified — access granted"));
});

// The requesting user's own purchase history
export const getMyPurchases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const purchases = await Purchase.find(filter)
    .populate("course", "title thumbnail price currency slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPurchases = await Purchase.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        purchases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPurchases / parseInt(limit)),
          totalPurchases,
          hasNextPage: parseInt(page) < Math.ceil(totalPurchases / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1,
        },
      },
      "Purchases fetched successfully"
    )
  );
});

// ADMIN: who has purchased a given course
export const getCoursePurchases = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { page = 1, limit = 20, status = "COMPLETED" } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { course: courseId };
  if (status && status !== "all") filter.status = status;

  const purchases = await Purchase.find(filter)
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalPurchases = await Purchase.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        purchases,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPurchases / parseInt(limit)),
          totalPurchases,
          hasNextPage: parseInt(page) < Math.ceil(totalPurchases / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1,
        },
      },
      "Course purchases fetched successfully"
    )
  );
});

// Start checkout for a cart of multiple courses at once. Free courses
// enroll instantly; paid courses (which must share one currency) are
// bundled into a single Razorpay order so the user pays once for all of
// them. Courses already owned, unpublished, or with an invalid id are
// skipped rather than failing the whole request — the response reports
// what happened to each one so the frontend can reconcile its cart.
export const initiateCartPurchase = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;

  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    throw new ApiError(400, "courseIds must be a non-empty array");
  }

  const uniqueIds = [...new Set(courseIds.map(String))];
  const validIds = uniqueIds.filter((id) => mongoose.isValidObjectId(id));
  const invalid = uniqueIds.filter((id) => !mongoose.isValidObjectId(id));

  const courses = await Course.find({ _id: { $in: validIds }, isPublished: true });
  const foundIds = new Set(courses.map((c) => c._id.toString()));
  invalid.push(...validIds.filter((id) => !foundIds.has(id)));

  const existingPurchases = await Purchase.find({
    user: req.user._id,
    course: { $in: validIds },
    status: "COMPLETED",
  }).select("course");
  const ownedIds = new Set(existingPurchases.map((p) => p.course.toString()));

  const freeCourses = [];
  const paidCourses = [];
  const alreadyOwned = [];

  for (const course of courses) {
    const id = course._id.toString();
    if (ownedIds.has(id)) {
      alreadyOwned.push({ courseId: id, title: course.title });
    } else if (course.price === 0) {
      freeCourses.push(course);
    } else {
      paidCourses.push(course);
    }
  }

  for (const course of freeCourses) {
    await Purchase.create({
      user: req.user._id,
      course: course._id,
      amount: 0,
      currency: course.currency,
      status: "COMPLETED",
      completedAt: new Date(),
    });
    await grantEnrollment(req.user._id, course._id);
  }
  const freeEnrolled = freeCourses.map((c) => ({ courseId: c._id.toString(), title: c.title }));

  let payment = null;
  if (paidCourses.length > 0) {
    const currencies = new Set(paidCourses.map((c) => c.currency));
    if (currencies.size > 1) {
      throw new ApiError(400, "All paid courses in a single checkout must use the same currency");
    }
    const currency = paidCourses[0].currency;
    const amount = paidCourses.reduce((sum, c) => sum + c.price, 0);

    const order = await getRazorpay().orders.create({
      amount,
      currency,
      // Razorpay caps receipt at 40 chars — see the note in initiatePurchase.
      receipt: `cart_${req.user._id.toString().slice(-8)}_${Date.now().toString(36)}`,
    });

    await Purchase.insertMany(
      paidCourses.map((course) => ({
        user: req.user._id,
        course: course._id,
        amount: course.price,
        currency: course.currency,
        status: "CREATED",
        razorpayOrderId: order.id,
      }))
    );

    payment = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      courseIds: paidCourses.map((c) => c._id.toString()),
    };
  }

  res.status(201).json(
    new ApiResponse(
      201,
      { freeEnrolled, alreadyOwned, invalid, payment },
      payment ? "Order created" : "Processed"
    )
  );
});

// Verify a completed cart checkout and grant access to every course that
// was bundled into that Razorpay order.
export const verifyCartPurchase = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "razorpay_order_id, razorpay_payment_id and razorpay_signature are required");
  }

  const purchases = await Purchase.find({
    user: req.user._id,
    razorpayOrderId: razorpay_order_id,
    status: "CREATED",
  });
  if (purchases.length === 0) throw new ApiError(404, "No pending purchases found for this order");

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  const purchaseIds = purchases.map((p) => p._id);

  if (!isValid) {
    await Purchase.updateMany({ _id: { $in: purchaseIds } }, { $set: { status: "FAILED" } });
    throw new ApiError(400, "Payment verification failed");
  }

  await Purchase.updateMany(
    { _id: { $in: purchaseIds } },
    {
      $set: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        completedAt: new Date(),
      },
    }
  );

  for (const purchase of purchases) {
    await grantEnrollment(req.user._id, purchase.course);
  }

  const completed = await Purchase.find({ _id: { $in: purchaseIds } }).populate(
    "course",
    "title thumbnail slug"
  );

  res.json(new ApiResponse(200, { purchases: completed }, "Payment verified — access granted"));
});
