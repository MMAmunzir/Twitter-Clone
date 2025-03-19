import Post from "../models/posts.model.js";
import User from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "post must have image or text" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "you can delete only your post" });
    }
    if (post.img) {
      const img = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(img);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id.toString();
    const postId = req.params.id;

    if (!text) return res.status(400).json({ error: "text is required" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "post not found" });

    const comment = {
      text,
      user: userId,
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "post unliked" });
    } else {
      post.likes.push(userId);
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        type: "like",
        to: post.user,
      });
      await notification.save();

      res.status(200).json({ message: "post liked" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0)
      return res.status(404).json({ message: "no posts found" });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "user not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "user not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "user not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};
