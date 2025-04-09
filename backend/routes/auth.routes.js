import express, { Router } from "express";
import {
  login,
  logout,
  signup,
  getMe,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../midleware/protectRoutes.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
