



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  Zap,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";

import "../index.css";

const Navbar = ({ user = {}, onLogout }) => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  /* ✅ MENU REF */
  const menuRef = useRef(null);


  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  return (
    <header className="header">

      <div className="container">

        {/* ===== Brand ===== */}
        <div className="item">

          <div className="button-nav">
            <Zap className="button-zap" />
            <div className="ping-dot" />
          </div>

          <span className="brand-name">
            TaskFlow
          </span>

        </div>


        {/* ===== Right Nav ===== */}
        <div className="right-nav">

          <button
            className="button-r"
            onClick={() => navigate("/dashboard/profile")}
          >
            <Settings className="button-settings" />
          </button>


          {/* ===== User Button + Menu ===== */}
          <div className="relative" ref={menuRef}>

            <button
              className="custom-button"
              onClick={() => setOpen(!open)}
            >

              {user.avatar ? (

                <img
                  src={user.avatar}
                  className="icon-box"
                  alt="user"
                />

              ) : (

                <div className="icon-box1">
                  {user.name?.[0] || "U"}
                </div>

              )}


              <div className="user-text">

                <span className="user-name">
                  {user.name || "User"}
                </span>

                <span className="user-email">
                  {user.email || "user@email.com"}
                </span>

              </div>


              <ChevronDown
                className={`drop-icon ${
                  open ? "rotate-180" : ""
                }`}
              />

            </button>


            {/* ===== Dropdown ===== */}
            {open && (

              <ul className="menu-dropdown">

                <li className="menu-item">

                  <button
                    className="menu-button"
                    onClick={() => {
                      setOpen(false);
                      navigate("/dashboard/profile");
                    }}
                  >
                    <Settings className="drop-icon" />
                    Profile Settings
                  </button>

                </li>


                <li className="logout-item">

                  <button
                    className="logout-button"
                    onClick={() => {
                      setOpen(false);
                      onLogout();
                    }}
                  >
                    <LogOut className="drop-icon" />
                    Logout
                  </button>

                </li>

              </ul>

            )}

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
