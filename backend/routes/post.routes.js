import express from "express";
import { protectRoute } from "../midleware/protectRoutes.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPost,
  likeUnlikePost,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/user/:userName", protectRoute, getUserPost);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
