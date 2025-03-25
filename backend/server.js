import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postsRoutes from "./routes/post.routes.js";
import NotificationRoutes from "./routes/notification.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/notifications", NotificationRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "/frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");
    res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  connectMongoDB();
});
