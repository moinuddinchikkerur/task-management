

// // src/App.jsx

// import React, { useState, useEffect } from "react";
// import {
//   Routes,
//   Route,
//   Navigate,
//   useNavigate,
// } from "react-router-dom";

// /* ========== ADMIN PAGES ========== */
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminLogin from "./pages/AdminLogin";
// import AdminSettings from "./pages/AdminSettings";
// import AdminProfile from "./pages/AdminProfile";
// import AdminUsers from "./pages/AdminUsers";
// import AdminTasks from "./pages/AdminTasks";

// /* ========== ADMIN LAYOUT ========== */
// import AdminLayout from "./components/AdminLayout";

// /* ========== USER COMPONENTS ========== */
// import Login from "./components/Login";
// import SignUp from "./components/SignUp";
// import Layout from "./components/Layout";
// import Profile from "./components/Profile";

// /* ========== USER PAGES ========== */
// import Dashboard from "./pages/Dashboard";
// import PendingPage from "./pages/PendingPage";
// import CompletedPage from "./pages/CompletedPage";

// import "./index.css";

// const App = () => {
//   const navigate = useNavigate();

//   /* ================= STATES ================= */
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= RESTORE SESSION ================= */
//   useEffect(() => {
//     try {
//       const token = localStorage.getItem("token");
//       const userStr = localStorage.getItem("currentUser");

//       if (!token || !userStr) {
//         setCurrentUser(null);
//       } else {
//         const user = JSON.parse(userStr);
//         setCurrentUser(user);
//       }
//     } catch {
//       setCurrentUser(null);
//     }

//     setLoading(false);
//   }, []);

//   /* ================= LOGIN HANDLER ================= */
//   const handleAuthSubmit = (data) => {
//     const user = {
//       userId: data.userId,
//       email: data.email,
//       name: data.name,
//       role: data.role,
//     };

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("currentUser", JSON.stringify(user));

//     setCurrentUser(user);

//     if (user.role === "admin") {
//       navigate("/admin", { replace: true });
//     } else {
//       navigate("/dashboard", { replace: true });
//     }
//   };

//   /* ================= LOGOUT ================= */
//   const handleLogout = (isAdmin = false) => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("currentUser");

//     setCurrentUser(null);

//     if (isAdmin) {
//       window.location.href = "/admin-login";
//     } else {
//       window.location.href = "/login";
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 100 }}>
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <Routes>

//       {/* ================= DEFAULT (OPEN SIGNUP FIRST) ================= */}
//       <Route path="/" element={<Navigate to="/signup" replace />} />

//       {/* ================= SIGNUP ================= */}
//       <Route
//         path="/signup"
//         element={
//           currentUser ? (
//             <Navigate to="/dashboard" replace />
//           ) : (
//             <SignUp onSwitchMode={() => navigate("/login")} />
//           )
//         }
//       />

//       {/* ================= USER LOGIN ================= */}
//       <Route
//         path="/login"
//         element={
//           currentUser ? (
//             currentUser.role === "admin" ? (
//               <Navigate to="/admin" replace />
//             ) : (
//               <Navigate to="/dashboard" replace />
//             )
//           ) : (
//             <Login
//               onSubmit={handleAuthSubmit}
//               onSwitchMode={() => navigate("/signup")}
//             />
//           )
//         }
//       />

//       {/* ================= ADMIN LOGIN ================= */}
//       <Route
//         path="/admin-login"
//         element={
//           currentUser?.role === "admin" ? (
//             <Navigate to="/admin" replace />
//           ) : (
//             <AdminLogin />
//           )
//         }
//       />

//       {/* ================= USER AREA ================= */}
//       <Route
//         path="/dashboard"
//         element={
//           currentUser ? (
//             <Layout
//               user={currentUser}
//               onLogout={() => handleLogout(false)}
//             />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       >
//         <Route index element={<Dashboard />} />

//         <Route
//           path="profile"
//           element={
//             <Profile
//               user={currentUser}
//               setCurrentUser={setCurrentUser}
//               onLogout={() => handleLogout(false)}
//             />
//           }
//         />

//         <Route path="pending" element={<PendingPage />} />
//         <Route path="complete" element={<CompletedPage />} />
//       </Route>

//       {/* ================= ADMIN AREA ================= */}
//       <Route
//         path="/admin"
//         element={
//           currentUser?.role === "admin" ? (
//             <AdminLayout onLogout={() => handleLogout(true)} />
//           ) : (
//             <Navigate to="/admin-login" replace />
//           )
//         }
//       >
//         <Route index element={<AdminDashboard />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="users" element={<AdminUsers />} />
//         <Route path="tasks" element={<AdminTasks />} />
//         <Route path="profile" element={<AdminProfile />} />
//         <Route path="settings" element={<AdminSettings />} />
//       </Route>

//       {/* ================= 404 ================= */}
//       <Route path="*" element={<Navigate to="/signup" replace />} />

//     </Routes>
//   );
// };

// export default App;


// src/App.jsx

import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

/* ========== ADMIN PAGES ========== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";
import AdminUsers from "./pages/AdminUsers";
import AdminTasks from "./pages/AdminTasks";

/* ========== ADMIN LAYOUT ========== */
import AdminLayout from "./components/AdminLayout";

/* ========== USER COMPONENTS ========== */
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import Profile from "./components/Profile";

/* ========== USER PAGES ========== */
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletedPage from "./pages/CompletedPage";

import "./index.css";

const App = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("currentUser");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }

    setLoading(false);

  }, []);

  /* ================= LOGIN HANDLER ================= */
  const handleAuthSubmit = (data) => {

    const user = {
      userId: data.userId,
      email: data.email,
      name: data.name,
      role: data.role,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(user));

    setCurrentUser(user);

    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = (isAdmin = false) => {

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");

    setCurrentUser(null);

    if (isAdmin) {
      navigate("/admin-login", { replace: true });
    } else {
      navigate("/signup", { replace: true });
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* ================= DEFAULT → SIGNUP ================= */}
      <Route path="/" element={<Navigate to="/signup" replace />} />

      {/* ================= SIGNUP ================= */}
      <Route
        path="/signup"
        element={
          <SignUp onSwitchMode={() => navigate("/login")} />
        }
      />

      {/* ================= LOGIN ================= */}
      <Route
        path="/login"
        element={
          <Login
            onSubmit={handleAuthSubmit}
            onSwitchMode={() => navigate("/signup")}
          />
        }
      />

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ================= USER AREA ================= */}
      <Route
        path="/dashboard"
        element={
          currentUser ? (
            <Layout
              user={currentUser}
              onLogout={() => handleLogout(false)}
            />
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
              onLogout={() => handleLogout(false)}
            />
          }
        />

        <Route path="pending" element={<PendingPage />} />
        <Route path="complete" element={<CompletedPage />} />
      </Route>

      {/* ================= ADMIN AREA ================= */}
      <Route
        path="/admin"
        element={
          currentUser?.role === "admin" ? (
            <AdminLayout onLogout={() => handleLogout(true)} />
          ) : (
            <Navigate to="/admin-login" replace />
          )
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/signup" replace />} />

    </Routes>
  );
};

export default App;
