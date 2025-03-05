import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: string,
      required: true,
      unique: true,
    },
    fullName: {
      type: string,
      required: true,
    },
    password: {
      type: string,
      required: true,
      minLength: 6,
    },
    email: {
      type: string,
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profileImage: {
      type: string,
      default: "",
    },
    coverImage: {
      type: string,
      default: "",
    },
    bio: {
      type: string,
      default: "",
    },
    link: {
      type: string,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
