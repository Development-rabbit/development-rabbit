import express from "express";
import { handleBunnyWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();

// Public — called by Bunny's servers, not the browser. No JWT to check.
router.post("/bunny", handleBunnyWebhook);

export default router;
