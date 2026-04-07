

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../index.css";

import { Clock, TrendingUp, Zap } from "lucide-react";

const Layout = ({ user, onLogout }) => {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /* ================= FETCH TASKS ================= */
  const fetchTasks = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.clear();
        onLogout?.();
        window.location.href = "/signup";
        return;
      }

      const res = await axios.get(
        "https://task-management-l8em.onrender.com/api/task/gp",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const arr = Array.isArray(res.data?.tasks)
        ? res.data.tasks
        : [];

      setTasks(arr);

    } catch (err) {

      console.error("Fetch Tasks Error:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        onLogout?.();
        setError("Session expired. Please login again.");
        window.location.href = "/signup";
      } else {
        setError(err.message || "Failed to fetch tasks");
      }

    } finally {
      setLoading(false);
    }

  }, [onLogout]);


  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  /* ================= TASK STATS ================= */
  const stats = useMemo(() => {

    const completed = tasks.filter(
      (t) => t?.completed === true
    ).length;

    const totalCount = tasks.length;

    const pending = totalCount - completed;

    const completedPercentage = totalCount
      ? Math.round((completed / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completed,
      pending,
      completedPercentage,
    };

  }, [tasks]);


  /* ================= STAT CARD ================= */
  const StatCard = ({ title, value, icon }) => (
    <div className="la5">
      <div className="la6">

        <div className="la7">
          {icon}
        </div>

        <div className="la8">
          <p className="la9">{value}</p>
          <p className="la10">{title}</p>
        </div>

      </div>
    </div>
  );


  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="la11">
        <div className="la12" />
      </div>
    );
  }


  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="la13">
        <div className="la14">

          <p className="la15">
            Error loading tasks
          </p>

          <p className="la16">
            {error}
          </p>

          <button
            className="la17"
            onClick={fetchTasks}
          >
            Try again
          </button>

        </div>
      </div>
    );
  }


  /* ================= MAIN LAYOUT ================= */
  return (
    <div className="la1">

      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />


      <div className="la2">
        <div className="la3">


          {/* MAIN CONTENT */}
          <div className="la4">

            <Outlet
              context={{
                tasks,
                refreshTasks: fetchTasks,
              }}
            />

          </div>


          {/* RIGHT PANEL */}
          <div className="la18">


            {/* ================= STATS ================= */}
            <div className="la19">

              <h3 className="la20">
                <TrendingUp className="la21" />
                Task Statistics
              </h3>


              <div className="la22">

                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Zap className="la23" />}
                />

                <StatCard
                  title="Completed Tasks"
                  value={stats.completed}
                  icon={<Zap className="la23" />}
                />

                <StatCard
                  title="Pending Tasks"
                  value={stats.pending}
                  icon={<Zap className="la23" />}
                />

                <StatCard
                  title="Completed Rate"
                  value={`${stats.completedPercentage}%`}
                  icon={<Zap className="la23" />}
                />

              </div>


              {/* ================= PROGRESS ================= */}
              <div className="la24">

                <div className="la25">

                  {/* ❌ REMOVED CIRCLE ICON */}
                  <span className="la26">
                    Task Progress
                  </span>

                  <span className="la28">
                    {stats.completed} / {stats.totalCount}
                  </span>

                </div>


                <div className="la29">
                  <div className="la30">
                    <div className="la31">

                      <div
                        className="la32"
                        style={{
                          width: `${stats.completedPercentage}%`,
                        }}
                      />

                    </div>
                  </div>
                </div>

              </div>

            </div>


            {/* ================= RECENT ================= */}
            <div className="la33">

              <h3 className="la34">
                <Clock className="la35" />
                Recent Activity
              </h3>


              <div className="la36">

                {tasks
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((task) => (

                    <div
                      key={task._id || task.id}
                      className="la37"
                    >

                      <div className="la38">

                        <p className="la39">
                          {task?.title || "No Title"}
                        </p>

                        <p className="la40">
                          {task?.createdAt
                            ? new Date(task.createdAt).toLocaleDateString()
                            : "No date"}
                        </p>

                      </div>


                      <span
                        className={`la41 ${
                          task?.completed === true
                            ? "la42-done"
                            : "la42-pending"
                        }`}
                      >
                        {task?.completed === true
                          ? "Done"
                          : "Pending"}
                      </span>

                    </div>

                  ))}


                {tasks.length === 0 && (

                  <div className="la43">

                    <div className="la44">
                      <Clock className="la45" />
                    </div>

                    <p className="la46">
                      No recent activity
                    </p>

                    <p className="la47">
                      Tasks will appear here
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default Layout;
