



// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

/* Components */
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import Profile from "./components/Profile";

/* Pages */
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletedPage from "./pages/CompletedPage";

import "./index.css";

const App = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= CLEAR SESSION ON START ================= */
  useEffect(() => {
    // ❗ Always start fresh (no auto dashboard)
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    setCurrentUser(null);
    setLoading(false);
  }, []);

  /* ================= LOGIN HANDLER ================= */
  const handleAuthSubmit = (data) => {
    const user = {
      userId: data.userId,
      email: data.email,
      name: data.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name
      )}&background=random`,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    setCurrentUser(user);

    navigate("/dashboard", { replace: true });
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);

    navigate("/signup", { replace: true });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* DEFAULT → SIGNUP */}
      <Route path="/" element={<Navigate to="/signup" replace />} />


      {/* SIGNUP FIRST */}
      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignUp onSwitchMode={() => navigate("/login")} />
          )
        }
      />


      {/* LOGIN AFTER SIGNUP */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          )
        }
      />


      {/* PROTECTED DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <Layout user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      >

        <Route index element={<Dashboard />} />

        <Route
          path="profile"
          element={
            <Profile
              user={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
            />
          }
        />

        <Route path="pending" element={<PendingPage />} />
        <Route path="complete" element={<CompletedPage />} />

      </Route>

    </Routes>
  );
};

export default App;
