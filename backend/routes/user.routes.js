import express from "express";
import { protectRoute } from "../midleware/protectRoutes.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controllers.js";

const routes = express.Router();

routes.get("/profile/:userName", protectRoute, getUserProfile);
routes.get("/suggested", protectRoute, getSuggestedUsers);
routes.post("/follow/:id", protectRoute, followUnfollowUser);
routes.post("/update", protectRoute, updateUser);

export default routes;
