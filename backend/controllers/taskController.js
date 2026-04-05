





import Task from "../models/taskModel.js";


/* ================= CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      dueDate,
      status,
      completed,
    } = req.body;


    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    /* STATUS SYNC */

    let taskStatus = status || "pending";

    if (
      completed === true ||
      completed === "true" ||
      taskStatus === "completed"
    ) {
      taskStatus = "completed";
    }

    if (!["pending", "in-progress", "completed"].includes(taskStatus)) {
      taskStatus = "pending";
    }


    const task = new Task({

      title,
      description,
      priority,
      dueDate,

      status: taskStatus,
      completed: taskStatus === "completed",

      owner: req.user._id,

    });


    const saved = await task.save();


    res.status(201).json({
      success: true,
      task: saved,
    });

  } catch (err) {

    console.error("Create Task Error:", err);

    res.status(400).json({
      success: false,
      message: "Failed to create task",
    });
  }
};



/* ================= GET USER TASKS ================= */
export const getTask = async (req, res) => {
  try {

    const tasks = await Task.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (err) {

    console.error("Get Tasks Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};



/* ================= GET ONE TASK ================= */
export const getTaskById = async (req, res) => {
  try {

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });


    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    res.status(200).json({
      success: true,
      task,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};



/* ================= UPDATE TASK (USER) ================= */
export const updateTask = async (req, res) => {
  try {

    const data = { ...req.body };


    /* STATUS SYNC */

    if (data.status === "completed") {
      data.completed = true;
    }

    if (data.completed === true || data.completed === "true") {
      data.status = "completed";
      data.completed = true;
    }


    if (
      data.status &&
      !["pending", "in-progress", "completed"].includes(data.status)
    ) {
      data.status = "pending";
    }


    const updated = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      data,
      { new: true }
    );


    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    res.status(200).json({
      success: true,
      task: updated,
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: "Update failed",
    });
  }
};



/* ================= UPDATE TASK (ADMIN) ================= */
export const updateTaskAdmin = async (req, res) => {
  try {

    const data = { ...req.body };


    /* STATUS SYNC */

    if (data.status === "completed") {
      data.completed = true;
    }

    if (data.completed === true || data.completed === "true") {
      data.status = "completed";
      data.completed = true;
    }

    if (
      data.status &&
      !["pending", "in-progress", "completed"].includes(data.status)
    ) {
      data.status = "pending";
    }


    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );


    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    res.status(200).json({
      success: true,
      task: updated,
    });

  } catch (err) {

    console.error("Admin Update Error:", err);

    res.status(400).json({
      success: false,
      message: "Admin update failed",
    });
  }
};



/* ================= DELETE TASK ================= */
export const deleteTask = async (req, res) => {
  try {

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
    });


    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "Task deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};



/* ================= ADMIN STATS (FILTER + FIXED) ================= */
export const getTaskStats = async (req, res) => {
  try {

    const { userId } = req.query;

    let filter = {};

    // Filter by user
    if (userId) {
      filter.owner = userId;
    }


    // TOTAL
    const total = await Task.countDocuments(filter);


    // COMPLETED
    const completed = await Task.countDocuments({
      ...filter,
      $or: [
        { status: "completed" },
        { completed: true },
      ],
    });


    // PENDING
    const pending = await Task.countDocuments({
      ...filter,
      status: "pending",
      completed: false,
    });


    // IN PROGRESS
    const inProgress = await Task.countDocuments({
      ...filter,
      status: "in-progress",
    });


    // OVERDUE
    const overdue = await Task.countDocuments({
      ...filter,
      status: { $ne: "completed" },
      completed: false,
      dueDate: { $lt: new Date() },
    });


    res.status(200).json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
    });

  } catch (err) {

    console.error("Stats Error:", err);

    res.status(500).json({
      message: "Stats failed",
    });
  }
};



/* ================= ADMIN GET ALL TASKS (FILTER) ================= */
export const getAllTasksAdmin = async (req, res) => {
  try {

    const { userId } = req.query;

    let filter = {};

    if (userId) {
      filter.owner = userId;
    }


    const tasks = await Task.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      tasks,
    });

  } catch (err) {

    console.error("Admin Fetch Error:", err);

    res.status(500).json({
      success: false,
      message: "Admin fetch failed",
    });
  }
};
