import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getMyPurchases } from "../controllers/purchase.controller.js";

const router = express.Router();

router.get("/me", verifyJwt, getMyPurchases);

export default router;
