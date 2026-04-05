



import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ 1 YEAR TOKEN
const TOKEN_EXPIRY = "365d";

/* ================= TOKEN ================= */
const createToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};


/* ================= GET ALL USERS (FILTER SUPPORT) ================= */
export const getAllUsers = async (req, res) => {
  try {

    const { id } = req.query;

    let filter = {};

    // If userId sent → return only that user
    if (id) {
      filter._id = id;
    }

    const users = await User.find(filter)
      .select("-password");

    res.json({
      success: true,
      users,
    });

  } catch (err) {

    console.error("Get All Users Error:", err);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};


/* ================= REGISTER ================= */
export async function registerUser(req, res) {
  try {

    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.toLowerCase().trim();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });

  } catch (error) {

    console.error("Delete Error:", error);

    res.status(500).json({
      message: "Delete failed",
    });
  }
};


/* ================= BLOCK / UNBLOCK ================= */
export const toggleBlockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      success: true,
      blocked: user.isBlocked,
    });

  } catch (error) {

    console.error("Block Error:", error);

    res.status(500).json({
      message: "Block failed",
    });
  }
};


/* ================= LOGIN ================= */
export async function loginUser(req, res) {
  try {

    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked === true) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


/* ================= CURRENT USER ================= */
export async function getCurrentUser(req, res) {
  try {

    const user = await User.findById(req.user._id)
      .select("name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


/* ================= UPDATE PROFILE ================= */
export async function updateProfile(req, res) {
  try {

    let { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email;

    await user.save();

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


/* ================= UPDATE PASSWORD ================= */
export async function updatePassword(req, res) {
  try {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated",
    });

  } catch (error) {

    console.error("Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
