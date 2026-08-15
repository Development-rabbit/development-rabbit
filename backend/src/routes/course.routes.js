import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourseDetail,
  toggleCourseLike,
  getCourseReviews,
  addOrUpdateCourseReview,
  deleteCourseReview,
} from "../controllers/course.controller.js";
import {
  createModule,
  updateModule,
  deleteModule,
  getModules,
  reorderModules,
} from "../controllers/module.controller.js";
import {
  createContent,
  updateContent,
  deleteContent,
  reorderContent,
  retryVideoUpload,
} from "../controllers/content.controller.js";
import { initiatePurchase, verifyPurchase, getCoursePurchases } from "../controllers/purchase.controller.js";

const router = express.Router();

const uploadContentFiles = upload.fields([
  { name: "media", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// ---- Course browsing (public, personalized when logged in) ----
router.get("/", optionalAuth, getCourses);
router.get("/:courseId", optionalAuth, getCourseDetail);

// ---- Course management (ADMIN only) ----
router.post("/", verifyJwt, isAdmin, upload.single("thumbnail"), createCourse);
router.patch("/:courseId", verifyJwt, isAdmin, upload.single("thumbnail"), updateCourse);
router.delete("/:courseId", verifyJwt, isAdmin, deleteCourse);

// ---- Likes ----
router.post("/:courseId/like", verifyJwt, toggleCourseLike);

// ---- Reviews ----
router.get("/:courseId/reviews", optionalAuth, getCourseReviews);
router.post("/:courseId/reviews", verifyJwt, addOrUpdateCourseReview);
router.delete("/:courseId/reviews/:reviewId", verifyJwt, deleteCourseReview);

// ---- Modules ----
router.get("/:courseId/modules", optionalAuth, getModules);
router.post("/:courseId/modules", verifyJwt, isAdmin, createModule);
router.patch("/:courseId/modules/reorder", verifyJwt, isAdmin, reorderModules);
router.patch("/:courseId/modules/:moduleId", verifyJwt, isAdmin, updateModule);
router.delete("/:courseId/modules/:moduleId", verifyJwt, isAdmin, deleteModule);

// ---- Content (within a module) ----
router.post(
  "/:courseId/modules/:moduleId/content",
  verifyJwt,
  isAdmin,
  uploadContentFiles,
  createContent
);
router.patch("/:courseId/modules/:moduleId/content/reorder", verifyJwt, isAdmin, reorderContent);
router.patch(
  "/:courseId/modules/:moduleId/content/:contentId",
  verifyJwt,
  isAdmin,
  uploadContentFiles,
  updateContent
);
router.delete("/:courseId/modules/:moduleId/content/:contentId", verifyJwt, isAdmin, deleteContent);
router.post(
  "/:courseId/modules/:moduleId/content/:contentId/retry-upload",
  verifyJwt,
  isAdmin,
  retryVideoUpload
);

// ---- Purchases (Razorpay) ----
router.post("/:courseId/purchase/initiate", verifyJwt, initiatePurchase);
router.post("/:courseId/purchase/verify", verifyJwt, verifyPurchase);
router.get("/:courseId/purchases", verifyJwt, isAdmin, getCoursePurchases);

export default router;
