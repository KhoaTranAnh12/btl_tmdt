import express from "express";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {deleteOrders, getAllOrders} from "../controllers/order.controller.js"

const router = express.Router();
//Thêm vào, mai check API
router.get("/all",protectRoute,adminRoute,getAllOrders);
router.delete("/delete/:id",protectRoute,adminRoute,deleteOrders);

export default router;