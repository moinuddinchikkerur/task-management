import React from "react";

import {
  LayoutDashboard,
  Users,
  ListTodo,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import "../index.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">

      {/* LOGO */}
      <div className="sidebar-header">
        <h2>TaskFlow</h2>
        <p>Admin Panel</p>
      </div>


      {/* MENU */}
      <div className="sidebar-menu">

        {/* DASHBOARD */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>


        {/* USERS */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Users size={18} />
          <span>Users</span>
        </NavLink>


        {/* TASKS */}
        <NavLink
          to="/admin/tasks"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <ListTodo size={18} />
          <span>Tasks</span>
        </NavLink>

      </div>

    </div>
  );
};

export default AdminSidebar;
