



import React, { useState } from "react";
import axios from "axios";
import { isToday, format } from "date-fns";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Check,
} from "lucide-react";

import TaskModal from "./TaskModal";
import "../index.css";

/* API */
const API_BASE = "https://task-management-l8em.onrender.com/api/task";

/* Menu Options */
const MENU_OPTIONS = [
  {
    action: "edit",
    label: "Edit Task",
    icon: <Edit2 size={14} className="text-purple-600" />,
  },
  {
    action: "delete",
    label: "Delete Task",
    icon: <Trash2 size={14} className="text-red-600" />,
  },
];

const TaskItem = ({ task, onRefresh, onLogout }) => {

  if (!task) return null;

  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Auth Headers */
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No auth token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  /* Completed */
  const isDone = task.completed === true;

  /* ================= TOGGLE COMPLETE ================= */
  const handleToggleComplete = async () => {
    try {
      setLoading(true);

      const newStatus = !isDone; // ✅ BOOLEAN

      await axios.put(
        `${API_BASE}/${task._id || task.id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );

      onRefresh?.();

    } catch (err) {
      console.error("Toggle error:", err);

      if (err.response?.status === 401) {
        onLogout?.();
      }

    } finally {
      setLoading(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API_BASE}/${task._id || task.id}/gp`,
        { headers: getAuthHeaders() }
      );

      onRefresh?.();

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        onLogout?.();
      }
    }
  };

  /* Save Edit */
  const handleSave = async (updatedTask) => {
    try {
      const payload = (({
        title,
        description,
        priority,
        dueDate,
        completed,
      }) => ({
        title,
        description,
        priority,
        dueDate,
        completed,
      }))(updatedTask);

      await axios.put(
        `${API_BASE}/${task._id || task.id}/gp`,
        payload,
        { headers: getAuthHeaders() }
      );

      setShowEditModal(false);
      onRefresh?.();

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        onLogout?.();
      }
    }
  };

  /* Menu */
  const handleAction = (action) => {
    setShowMenu(false);

    if (action === "edit") setShowEditModal(true);

    if (action === "delete") handleDelete();
  };

  return (
    <>

      {/* CARD */}
      <div className={`card ${isDone ? "card-done" : ""}`}>

        {/* LEFT */}
        <div className="card-left">

          {/* COMPLETE BUTTON */}
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`card-check ${
              isDone ? "card-check-done" : ""
            }`}
          >
            {isDone && <Check size={14} />}
          </button>

          {/* TEXT */}
          <div>

            <div className="card-header">

              <h3
                className={`card-title ${
                  isDone ? "card-title-done" : ""
                }`}
              >
                {task.title || "Untitled"}
              </h3>

              <span
                className={`card-badge card-${task.priority?.toLowerCase()}`}
              >
                {task.priority}
              </span>

            </div>

            {task.description && (
              <p className="card-desc">
                {task.description}
              </p>
            )}

          </div>

        </div>


        {/* RIGHT */}
        <div className="card-right">

          {/* Menu */}
          <div className="card-menu-box">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="card-menu"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div className="card-dropdown">

                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="card-option"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* Dates */}
          <div className="card-dates">

            <div
              className={`card-date ${
                task.dueDate &&
                isToday(new Date(task.dueDate))
                  ? "card-date-today"
                  : ""
              }`}
            >
              <Calendar size={13} />

              {task.dueDate
                ? isToday(new Date(task.dueDate))
                  ? "Today"
                  : format(new Date(task.dueDate), "MMM dd")
                : "-"}
            </div>

            <div className="card-created">
              <Clock size={12} />

              {task.createdAt
                ? `Created ${format(
                    new Date(task.createdAt),
                    "MMM dd"
                  )}`
                : "No date"}
            </div>

          </div>

        </div>

      </div>


      {/* EDIT MODAL */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />

    </>
  );
};

export default TaskItem;
