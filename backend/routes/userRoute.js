




import express from "express";

import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile
} from "../controllers/userController.js";

const userRouter = express.Router();


/* ================= PUBLIC ROUTES ================= */

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);


/* ================= ADMIN ROUTES ================= */

userRouter.get(
  "/admin/users",
  authMiddleware,
  adminAuth,
  getAllUsers
);


userRouter.delete(
  "/admin/user/:id",
  authMiddleware,
  adminAuth,
  deleteUser
);


userRouter.put(
  "/admin/block/:id",
  authMiddleware,
  adminAuth,
  toggleBlockUser
);


/* ================= USER ROUTES ================= */

userRouter.get(
  "/me",
  authMiddleware,
  getCurrentUser
);


userRouter.put(
  "/profile",
  authMiddleware,
  updateProfile
);


userRouter.put(
  "/password",
  authMiddleware,
  updatePassword
);


export default userRouter;
