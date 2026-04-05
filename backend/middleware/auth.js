


import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function authMiddleware(req, res, next) {

  const authHeader = req.headers.authorization;

  // ❌ No header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  // ❌ Empty / Invalid token
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }

  try {

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();

  } catch (err) {

    console.error("JWT verification failed:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
}
