import express from "express";
import { protectRoute } from "../midleware/protectRoutes.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
} from "../controllers/user.controllers.js";

const routes = express.Router();

routes.get("/profile/:userName", protectRoute, getUserProfile);
routes.get("/suggested", protectRoute, getSuggestedUsers);
routes.post("/follow/:id", protectRoute, followUnfollowUser);
// routes.post("/update",protectRoute,updateUserProfile)

export default routes;
