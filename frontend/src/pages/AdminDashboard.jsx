





import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";

import "../index.css";

/* ================= REGISTER CHART ================= */

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {

  /* ================= NAV ================= */
  const location = useLocation();
  const navigate = useNavigate();

  /* ================= GET USER ID ================= */
  const query = new URLSearchParams(location.search);
  const userId = query.get("userId");


  /* ================= STATES ================= */

  const [users, setUsers] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {

      let url = "https://task-management-l8em.onrender.com/api/user/admin/users";

      if (userId) {
        url += `?id=${userId}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.users || []);

    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };


  /* ================= FETCH TASK STATS ================= */

  const fetchTaskStats = async () => {
    try {

      let url = "https://task-management-l8em.onrender.com/api/task/admin/stats";

      if (userId) {
        url += `?userId=${userId}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskStats(res.data || null);

    } catch (err) {
      console.error(err);
    }
  };


  /* ================= INIT ================= */

  useEffect(() => {

    const init = async () => {
      await Promise.all([
        fetchUsers(),
        fetchTaskStats(),
      ]);

      setLoading(false);
    };

    init();

  }, [userId]);


  /* ================= SELECTED USER ================= */

  const selectedUser = userId ? users[0] : null;


  /* ================= STATS ================= */

  const totalUsers = users.length;

  const activeUsers = users.filter((u) => !u.isBlocked).length;

  const blockedUsers = users.filter((u) => u.isBlocked).length;

  const adminUsers = users.filter((u) => u.role === "admin").length;


  /* ================= CHART OPTIONS ================= */

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    }),
    []
  );


  /* ================= USER STATUS CHART ================= */

  const userChartData = useMemo(() => {

    // When viewing ONE user
    if (userId && selectedUser) {

      return {
        labels: ["Active", "Blocked"],
        datasets: [
          {
            data: [
              selectedUser.isBlocked ? 0 : 1,
              selectedUser.isBlocked ? 1 : 0,
            ],
            backgroundColor: [
              "#22c55e",
              "#ef4444",
            ],
          },
        ],
      };
    }

    // Normal admin view
    return {
      labels: ["Active", "Blocked", "Admins"],
      datasets: [
        {
          data: [
            activeUsers,
            blockedUsers,
            adminUsers,
          ],
          backgroundColor: [
            "#22c55e",
            "#ef4444",
            "#6366f1",
          ],
        },
      ],
    };

  }, [
    userId,
    selectedUser,
    activeUsers,
    blockedUsers,
    adminUsers,
  ]);


  /* ================= TASK CHART (NO IN PROGRESS) ================= */

  const taskChartData = useMemo(() => {

    if (!taskStats) return null;

    return {
      labels: [
        "Completed",
        "Pending",
        "Overdue",
      ],
      datasets: [
        {
          label: "Tasks",
          data: [
            taskStats.completed,
            taskStats.pending,
            taskStats.overdue,
          ],
          backgroundColor: [
            "#22c55e", // green
            "#f97316", // orange
            "#ef4444", // red
          ],
        },
      ],
    };

  }, [taskStats]);


  /* ================= LINE CHART ================= */

  const lineChartData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: userId
            ? "User Activity"
            : "New Users",
          data: [1, 2, 1, 3, 4, 2, 5], // demo data
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79,70,229,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [userId]
  );


  /* ================= LOADING ================= */

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }


  /* ================= UI ================= */

  return (
    <>

      {/* BACK BUTTON */}
      {userId && (
        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/admin/users")}
        >
          ← Back to Users
        </button>
      )}


      {/* HEADER */}
      <div className="admin-header">

        <h2>
          {userId
            ? `Analytics: ${selectedUser?.name || ""}`
            : "Admin Dashboard"}
        </h2>

        <p>
          {userId
            ? "Selected user performance"
            : "System overview & analytics"}
        </p>

      </div>


      {/* CARDS */}
      <div className="admin-cards">

        <div className="admin-card">
          <h3>{totalUsers}</h3>
          <p>{userId ? "User" : "Total Users"}</p>
        </div>

        <div className="admin-card green">
          <h3>{activeUsers}</h3>
          <p>Active</p>
        </div>

        <div className="admin-card red">
          <h3>{blockedUsers}</h3>
          <p>Blocked</p>
        </div>

        <div className="admin-card purple">
          <h3>{adminUsers}</h3>
          <p>Admins</p>
        </div>

      </div>


      {/* CHARTS */}
      <div className="admin-charts">

        {/* USER STATUS */}
        <div className="chart-box">
          <h3>User Status</h3>

          <div className="chart-container">
            <Pie
              data={userChartData}
              options={chartOptions}
            />
          </div>
        </div>


        {/* TASK PROGRESS */}
        {taskChartData && (
          <div className="chart-box">

            <h3>Task Progress</h3>

            <div className="chart-container">
              <Bar
                data={taskChartData}
                options={chartOptions}
              />
            </div>

          </div>
        )}


        {/* USER GROWTH */}
        <div className="chart-box">

          <h3>User Growth</h3>

          <div className="chart-container">
            <Line
              data={lineChartData}
              options={chartOptions}
            />
          </div>

        </div>

      </div>

    </>
  );
};

export default AdminDashboard;
