import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getMyPurchases, initiateCartPurchase, verifyCartPurchase } from "../controllers/purchase.controller.js";

const router = express.Router();

router.get("/me", verifyJwt, getMyPurchases);
router.post("/cart/initiate", verifyJwt, initiateCartPurchase);
router.post("/cart/verify", verifyJwt, verifyCartPurchase);

export default router;
