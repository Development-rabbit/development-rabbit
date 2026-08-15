import Razorpay from "razorpay";
import { ApiError } from "./ApiError.js";

// Lazy singleton: the Razorpay SDK throws synchronously at construction time
// if key_id/key_secret are missing. Building it eagerly at module load would
// crash the entire server on boot whenever Razorpay keys aren't configured
// yet, not just the payment routes — so it's built on first real use instead.
let razorpayInstance = null;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay is not configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
};

export { getRazorpay };
