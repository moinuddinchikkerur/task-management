



// src/components/AdminLayout.jsx

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "../index.css";

const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("currentUser");

      // ❌ No session
      if (!token || !userStr) {
        throw new Error("Missing session");
      }

      const user = JSON.parse(userStr);

      // ❌ Not admin
      if (!user || user.role !== "admin") {
        throw new Error("Not admin");
      }

      // ✅ OK
      setChecking(false);
    } catch (err) {
      console.log("Admin auth error:", err);

      // Clear + redirect
      localStorage.clear();
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  /* ================= LOADING ================= */

  if (checking) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 120,
          fontSize: 18,
        }}
      >
        Checking session...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div
      className={`admin-layout ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* SIDEBAR */}
      <AdminSidebar collapsed={collapsed} />

      {/* MAIN */}
      <div className="admin-main">
        {/* NAVBAR */}
        <AdminNavbar
          onToggle={() => setCollapsed(!collapsed)}
          onLogout={onLogout}   // ✅ PASS LOGOUT
        />

        {/* CONTENT */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
