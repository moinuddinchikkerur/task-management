


import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

  dueDate: {
    type: Date,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  completed: {   // Optional (sync with status)
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

});


// Auto update "updatedAt"
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Sync completed with status
  if (this.status === "completed") {
    this.completed = true;
  }

  next();
});


const Task =
  mongoose.models.Task ||
  mongoose.model("Task", taskSchema);

export default Task;
