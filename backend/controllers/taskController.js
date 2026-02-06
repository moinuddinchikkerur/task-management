


import Task from "../models/taskModel.js";


/* ================= CREATE TASK ================= */
export const createTask = async (req, res) => {
  try {

    const { title, description, priority, dueDate, completed } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    // ✅ FORCE BOOLEAN
    const isCompleted =
      completed === true ||
      completed === "Yes" ||
      completed === "true";

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: isCompleted,   // ONLY boolean
      owner: req.user._id,
    });

    const saved = await task.save();

    res.status(201).json({
      success: true,
      task: saved,
    });

  } catch (err) {

    console.error("Error creating task:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Error creating task",
    });
  }
};



/* ================= GET ALL TASKS ================= */
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

    console.error("Error fetching tasks:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
    });
  }
};



/* ================= GET ONE ================= */
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

    console.error("Error fetching task:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching task",
    });
  }
};



/* ================= UPDATE TASK ================= */
export const updateTask = async (req, res) => {
  try {

    const data = { ...req.body };

    // ✅ FORCE BOOLEAN ON UPDATE
    if (data.completed !== undefined) {

      data.completed =
        data.completed === true ||
        data.completed === "Yes" ||
        data.completed === "true";
    }

    const updated = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      data,
      {
        new: true,
        runValidators: true,
      }
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

    console.error("Error updating task:", err);

    res.status(400).json({
      success: false,
      message: err.message || "Error updating task",
    });
  }
};



/* ================= DELETE TASK ================= */
export const deleteTask = async (req, res) => {
  try {

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (err) {

    console.error("Error deleting task:", err);

    res.status(500).json({
      success: false,
      message: "Error deleting task",
    });
  }
};
