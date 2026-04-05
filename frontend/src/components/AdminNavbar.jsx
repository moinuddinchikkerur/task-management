



import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Menu,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../index.css";

const AdminNavbar = ({ onToggle, onLogout }) => {
  // ✅ receive onLogout

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    setOpen(false);

    // ✅ Use centralized logout
    if (onLogout) {
      onLogout();
    } else {
      // fallback safety
      localStorage.clear();
      navigate("/admin-login", { replace: true });
    }
  };

  /* ================= AVATAR LETTER ================= */
  const firstLetter =
    user?.name?.charAt(0).toUpperCase() || "A";

  return (
    <div className="admin-navbar">

      {/* LEFT */}
      <div className="admin-nav-left">
        <button
          className="nav-menu-btn"
          onClick={onToggle}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* CENTER */}
      <div className="admin-nav-center">
        Admin Dashboard
      </div>

      {/* RIGHT */}
      <div
        className="admin-nav-right"
        ref={menuRef}
      >

        {/* USER BOX */}
        <div
          className="admin-user-box"
          onClick={() => setOpen(!open)}
        >

          {/* AVATAR */}
          <div className="admin-avatar">
            {firstLetter}
          </div>

          {/* TEXT */}
          <div className="admin-user-text">
            <span className="admin-name">
              {user?.name || "Admin"}
            </span>

            <span className="admin-email">
              {user?.email || "admin@mail.com"}
            </span>
          </div>

          <ChevronDown size={16} />
        </div>

        {/* DROPDOWN */}
        {open && (

          <div className="profile-dropdown">

            {/* HEADER */}
            <div className="dropdown-header">
              <strong>
                {user?.name || "Admin"}
              </strong>

              <small>
                {user?.email || "admin@mail.com"}
              </small>
            </div>

            {/* PROFILE */}
            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/profile");
              }}
            >
              <User size={16} />
              Profile
            </button>

            {/* LOGOUT */}
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminNavbar;
