import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { hasCourseAccess } from "../middlewares/hasCourseAccess.middleware.js";
import { getContent } from "../controllers/content.controller.js";

const router = express.Router();

// The only route that ever returns a content item's real payload
// (videoUrl/body/questions) — gated by demo flag / admin / completed purchase.
router.get("/:contentId", verifyJwt, hasCourseAccess, getContent);

export default router;
