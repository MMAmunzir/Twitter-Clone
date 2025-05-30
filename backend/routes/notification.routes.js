import express from "express";
import { protectRoute } from "../midleware/protectRoutes.js";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.controllers.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);

export default router;
