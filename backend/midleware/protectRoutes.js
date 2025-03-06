import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "unauthorized:invalid token" });
    }
    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};
