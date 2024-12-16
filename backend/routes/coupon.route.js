import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { createCoupon, deleteCoupons, getAllCoupons, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/validate", protectRoute, validateCoupon);
//Thêm vào, mai check
router.get("/all", protectRoute, adminRoute, getAllCoupons);
router.post("/", protectRoute, adminRoute, createCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupons);

export default router;
