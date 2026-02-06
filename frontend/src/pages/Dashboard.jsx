

import React, { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

import {
  Plus,
  HomeIcon,
  Filter,
  CalendarIcon,
} from "lucide-react";

import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";

import "../index.css";

/* FILTER OPTIONS */
const FILTER_OPTIONS = ["all", "today", "week", "high", "medium", "low"];

const FILTER_LABELS = {
  all: "All Tasks",
  today: "Today's Tasks",
  week: "This Week",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const Dashboard = () => {

  const { tasks, refreshTasks } = useOutletContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");


  /* ================= FIXED SAVE HANDLER ================= */
  // ❌ No API call here
  // ✅ Only refresh
  const handleTaskSave = useCallback(async () => {
    try {

      await refreshTasks(); // reload tasks

      setShowModal(false);
      setSelectedTask(null);

    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, [refreshTasks]);


  /* ================= STATS ================= */
  const stats = useMemo(() => ({
    total: tasks.length,

    low: tasks.filter(
      (t) => t.priority?.toLowerCase() === "low"
    ).length,

    medium: tasks.filter(
      (t) => t.priority?.toLowerCase() === "medium"
    ).length,

    high: tasks.filter(
      (t) => t.priority?.toLowerCase() === "high"
    ).length,

  }), [tasks]);


  const STAT_LIST = [
    { key: "total", label: "Total Tasks", value: stats.total },
    { key: "low", label: "Low Priority", value: stats.low },
    { key: "medium", label: "Medium Priority", value: stats.medium },
    { key: "high", label: "High Priority", value: stats.high },
  ];


  /* ================= FILTER ================= */
  const filteredTasks = useMemo(() => {

    return tasks.filter((task) => {

      const due = new Date(task.dueDate);
      const today = new Date();

      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      switch (filter) {

        case "today":
          return due.toDateString() === today.toDateString();

        case "week":
          return due >= today && due <= nextWeek;

        case "high":
        case "medium":
        case "low":
          return task.priority?.toLowerCase() === filter;

        default:
          return true;
      }

    });

  }, [tasks, filter]);


  return (
    <div className="da1">


      {/* ================= HEADER ================= */}
      <div className="da2">

        <div>
          <h1 className="da4">
            <HomeIcon className="da5" />
            Task Overview
          </h1>

          <p className="da7">
            Manage your tasks efficiently
          </p>
        </div>


        <button
          className="da8"
          onClick={() => {
            setSelectedTask(null);
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          Add New Task
        </button>

      </div>



      {/* ================= STATS ================= */}
      <div className="da9">

        {STAT_LIST.map((item) => (

          <div key={item.key} className="da10">

            <div className={`da32 da32-${item.key}`}>

              {item.key === "total" && <HomeIcon size={18} />}
              {item.key === "low" && "💧"}
              {item.key === "medium" && "🔥"}
              {item.key === "high" && "⚡"}

            </div>

            <div className="da33">

              <span className={`da34 da34-${item.key}`}>
                {item.value}
              </span>

              <p className="da11">
                {item.label}
              </p>

            </div>

          </div>

        ))}

      </div>



      {/* ================= FILTER ================= */}
      <div className="da13">

        <div className="da14">
          <Filter className="da15" />

          <h2 className="da16">
            {FILTER_LABELS[filter]}
          </h2>
        </div>


        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="da17"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>


        <div className="da18">

          {FILTER_OPTIONS.map((opt) => (

            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`da19 ${filter === opt ? "da20" : "da21"}`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>

          ))}

        </div>

      </div>



      {/* ================= TASK LIST ================= */}
      <div className="da22">

        {filteredTasks.length === 0 ? (

          <div className="da23">

            <div className="da24">
              <CalendarIcon className="da5" />
            </div>

            <h3 className="da25">No tasks found</h3>

            <p className="da26">
              Create your first task
            </p>

            <button
              className="da27"
              onClick={() => setShowModal(true)}
            >
              Add New Task
            </button>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
            />

          ))

        )}

      </div>



      {/* ================= MODAL ================= */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />

    </div>
  );
};

export default Dashboard;
