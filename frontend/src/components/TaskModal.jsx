

import React, { useState, useEffect, useCallback } from "react";
import "../index.css";
import {
  Save,
  PlusCircle,
  X,
  AlignLeft,
  Flag,
  Calendar,
  CheckCircle,
} from "lucide-react";

/* DEFAULT TASK */
export const DEFAULT_TASK = {
  title: "",
  description: "",
  priority: "low",
  dueDate: "",
  completed: "No",
  id: null,
};

/* API */
const API_BASE = "https://task-management-l8em.onrender.com/api/task";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  /* Handle Change */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* Headers */
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No auth Token Found");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  /* Load Edit Data */
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === "Yes" || taskToEdit.completed === true
          ? "Yes"
          : "No";

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
      setError(null);
    }
  }, [isOpen, taskToEdit]);

  /* Submit */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData.id);

        const url = isEdit
          ? `${API_BASE}/${taskData.id}/gp`
          : `${API_BASE}/gp`;

        const resp = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });

        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();

          const err = await resp.json();
          throw new Error(err.message || "Failed to save task");
        }

        // ✅ FIXED RESPONSE HANDLING
        const result = await resp.json();

        onSave?.(result.task); // send only task
        onClose();

      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="tm1">
      <div className="tm2">

        {/* Header */}
        <div className="tm3">

          <h2 className="tm4">
            {taskData.id ? (
              <Save className="tm10" />
            ) : (
              <PlusCircle className="tm10" />
            )}

            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>

          <button onClick={onClose} className="tm5">
            <X className="tm11" />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tm12">

          {error && <div className="tm13">{error}</div>}

          {/* Title */}
          <div className="tm14">

            <label className="tm15">Task Title</label>

            <div className="tm16">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="tm17"
                placeholder="Enter task title"
              />
            </div>

          </div>

          {/* Description */}
          <div className="tm14">

            <label className="tm18">
              <AlignLeft className="tm19" />
              Description
            </label>

            <textarea
              name="description"
              rows="3"
              value={taskData.description}
              onChange={handleChange}
              className="tm20"
              placeholder="Add details"
            />

          </div>

          {/* Grid */}
          <div className="tm21">

            {/* Priority */}
            <div className="tm14">

              <label className="tm18">
                <Flag className="tm19" />
                Priority
              </label>

              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="tm20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

            </div>

            {/* Due Date */}
            <div className="tm14">

              <label className="tm18">
                <Calendar className="tm19" />
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className="tm20"
              />

            </div>

          </div>

          {/* Status */}
          <div className="tm14">

            <label className="tm18">
              <CheckCircle className="tm19" />
              Status
            </label>

            <div className="tm22">

              {[
                { val: "Yes", label: "Completed" },
                { val: "No", label: "In Progress" },
              ].map(({ val, label }) => (
                <label key={val} className="tm23">

                  <input
                    type="radio"
                    name="completed"
                    value={val}
                    checked={taskData.completed === val}
                    onChange={handleChange}
                    className="tm24"
                  />

                  <span className="tm25">{label}</span>

                </label>
              ))}

            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="tm26"
          >

            {loading ? (
              <>
                <Save className="tm27" />
                Saving...
              </>
            ) : (
              <>
                <PlusCircle className="tm27" />
                {taskData.id ? "Update Task" : "Save Task"}
              </>
            )}

          </button>

        </form>

      </div>
    </div>
  );
};

export default TaskModal;



