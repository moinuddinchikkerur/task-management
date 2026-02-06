



import React, { useState, useMemo } from "react";
import { ListChecks, Filter, Plus, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";

import "../index.css";

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "priority", label: "Priority" },
];

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();

  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  /* ================= FILTER + SORT ================= */
  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" &&
          t.completed.toLowerCase() === "no")
    );

    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      const order = { high: 3, medium: 2, low: 1 };

      return (
        order[b.priority?.toLowerCase()] -
        order[a.priority?.toLowerCase()]
      );
    });
  }, [tasks, sortBy]);

  return (
    <div className="pp1">

      {/* ================= HEADER ================= */}
      <div className="pp2">

        <div>
          <h1 className="pp3">
            <ListChecks className="pp4" />
            Pending Task
          </h1>

          <p className="pp5">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>


        {/* ================= SORT ================= */}
        <div className="pp6">

          <div className="pp6-left">
            <Filter className="pp6-icon" />
            <span>Sort by:</span>
          </div>

          <div className="pp6-tabs">

            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`pp6-btn ${
                  sortBy === opt.id ? "pp6-active" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}

          </div>

        </div>

      </div>


      {/* ================= ADD BOX ================= */}
      <div
        className="pp7"
        onClick={() => {
          setSelectedTask(null);
          setShowModal(true);
        }}
      >
        <Plus size={20} />
        Add New Task
      </div>


      {/* ================= LIST ================= */}
      <div className="pp8">

        {sortedPendingTasks.length === 0 ? (

          /* EMPTY */
          <div className="pp9">

            <div className="pp10">
              <Clock size={30} />
            </div>

            <h3>All caught up!</h3>

            <p>No pending tasks - great work!</p>

            <button
              onClick={() => setShowModal(true)}
              className="pp11"
            >
              Create New Task
            </button>

          </div>

        ) : (

          sortedPendingTasks.map((task) => (

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
          refreshTasks();
        }}
        taskToEdit={selectedTask}
      />

    </div>
  );
};

export default PendingPage;
