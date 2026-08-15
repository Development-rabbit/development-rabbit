import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { hasCourseAccess } from "../middlewares/hasCourseAccess.middleware.js";
import { reportVideoProgress, getContinueLearningDashboard } from "../controllers/progress.controller.js";

const router = express.Router();

router.patch("/:contentId/heartbeat", verifyJwt, hasCourseAccess, reportVideoProgress);
router.get("/dashboard", verifyJwt, getContinueLearningDashboard);

export default router;
