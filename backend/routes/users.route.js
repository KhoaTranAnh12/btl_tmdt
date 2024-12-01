import express from "express";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {deleteUsers, getAllUsers} from "../controllers/user.controller.js"

const router = express.Router();
//Thêm vào, mai check API
router.get("/all",protectRoute,adminRoute,getAllUsers);
router.delete("/delete/:id",protectRoute,adminRoute,deleteUsers);

export default router;