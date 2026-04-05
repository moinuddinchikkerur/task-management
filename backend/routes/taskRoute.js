


import express from "express";

import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  createTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  getAllTasksAdmin,
  updateTaskAdmin, // ✅ NEW
} from "../controllers/taskController.js";

const taskRouter = express.Router();


/* ================= USER ================= */

taskRouter
  .route("/gp")
  .get(authMiddleware, getTask)
  .post(authMiddleware, createTask);


taskRouter
  .route("/:id/gp")
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask) // User update
  .delete(authMiddleware, deleteTask);



/* ================= ADMIN ================= */

// Get all tasks
taskRouter.get(
  "/admin/all",
  authMiddleware,
  adminAuth,
  getAllTasksAdmin
);


// Stats
taskRouter.get(
  "/admin/stats",
  authMiddleware,
  adminAuth,
  getTaskStats
);


// ✅ ADMIN UPDATE TASK (NEW)
taskRouter.put(
  "/admin/:id",
  authMiddleware,
  adminAuth,
  updateTaskAdmin
);


// Delete task (Admin)
taskRouter.delete(
  "/admin/:id",
  authMiddleware,
  adminAuth,
  deleteTask
);


export default taskRouter;
