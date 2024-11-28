import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleAvailableToTryProduct,
	toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/toggleFeatured/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.patch("/toggleTry/:id", protectRoute, adminRoute, toggleAvailableToTryProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
