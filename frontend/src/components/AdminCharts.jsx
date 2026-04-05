import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminCharts = ({ users, taskStats }) => {

  /* USER CHART */
  const userData = {
    labels: ["Active", "Blocked", "Admins"],
    datasets: [
      {
        data: [
          users.filter(u => !u.isBlocked).length,
          users.filter(u => u.isBlocked).length,
          users.filter(u => u.role === "admin").length,
        ],
        backgroundColor: ["#22c55e", "#ef4444", "#6366f1"],
      },
    ],
  };


  /* TASK CHART */
  const taskData = {
    labels: ["Completed", "Pending", "In Progress", "Overdue"],
    datasets: [
      {
        label: "Tasks",
        data: [
          taskStats?.completed || 0,
          taskStats?.pending || 0,
          taskStats?.inProgress || 0,
          taskStats?.overdue || 0,
        ],
        backgroundColor: "#22c55e",
      },
    ],
  };


  return (
    <div className="admin-charts">

      {/* USER PIE */}
      <div className="chart-box">
        <h3>User Status</h3>

        <Pie
          data={userData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>


      {/* TASK BAR */}
      <div className="chart-box">
        <h3>Task Progress</h3>

        <Bar
          data={taskData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>

    </div>
  );
};

export default AdminCharts;
