


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,   // ✅ IMPORTANT
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

isBlocked: {
  type: Boolean,
  default: false,
},


  },
  { timestamps: true }
);

const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
