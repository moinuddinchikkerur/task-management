


import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";

import { CheckCircle2, Filter } from "lucide-react";

import TaskItem from "../components/TaskItem";

import "../index.css";


/* SORT OPTIONS */
const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "priority", label: "Priority" },
];


const CompletePage = () => {

  /* Get Tasks */
  const { tasks = [], refreshTasks } = useOutletContext();

  /* Sort */
  const [sortBy, setSortBy] = useState("newest");


  /* ================= FILTER + SORT ================= */
  const sortedCompletedTasks = useMemo(() => {

    const filtered = tasks.filter(
      (task) =>
        task?.completed === true ||
        task?.completed === 1 ||
        (typeof task?.completed === "string" &&
          task.completed.toLowerCase() === "yes")
    );

    return filtered.sort((a, b) => {

      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };

        return (
          (order[b.priority?.toLowerCase()] || 0) -
          (order[a.priority?.toLowerCase()] || 0)
        );
      }

      return 0;

    });

  }, [tasks, sortBy]);


  return (
    <div className="cm1">


      {/* ================= HEADER ================= */}
      <div className="cm2">

        <div className="cm3">

          <h1 className="cm4">
            <CheckCircle2 className="cm5" />
            Completed Tasks
          </h1>

          <p className="cm6">
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && "s"} marked as complete
          </p>

        </div>


        {/* ================= SORT ================= */}
        <div className="cm17">

          <div className="cm18">
            <Filter className="cm19" />
            <span>Sort by:</span>
          </div>


          {/* Mobile */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cm20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>


          {/* Desktop */}
          <div className="cm21">

            {SORT_OPTIONS.map((opt) => (

              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`cm22 ${
                  sortBy === opt.id ? "cm23" : "cm24"
                }`}
              >
                {opt.label}
              </button>

            ))}

          </div>

        </div>

      </div>



      {/* ================= TASK LIST ================= */}
      <div className="cm7">

        {sortedCompletedTasks.length === 0 ? (

          /* EMPTY STATE */
          <div className="cm8">

            <div className="cm9">
              <CheckCircle2 className="cm16" />
            </div>

            <h3 className="cm10">
              No completed tasks yet!
            </h3>

            <p className="cm11">
              Complete some tasks and they'll appear here
            </p>

          </div>

        ) : (

          /* ✅ YOUR CODE ADDED HERE */
          sortedCompletedTasks.map((task) => (

            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="cm30"
            />

          ))

        )}

      </div>

    </div>
  );
};

export default CompletePage;
