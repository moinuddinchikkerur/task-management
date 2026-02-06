


import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Sparkle,
  Sparkles,
  Home,
  ListChecks,
  CheckCircle2,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import "../index.css";

/* ================= menuItems ================= */
export const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <Home className="sid21" />,
  },
  {
    text: "Pending Tasks",
    path: "/dashboard/pending",
    icon: <ListChecks className="sid21" />,
  },
  {
    text: "Completed Tasks",
    path: "/dashboard/complete",
    icon: <CheckCircle2 className="sid21" />,
  },
];

/* ================= Sidebar ================= */
const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  /* ===== lock body scroll on mobile ===== */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [mobileOpen]);

  /* ================= renderMenuItems ================= */
  const renderMenuItems = (isMobile = false) => (
    <ul className="sid15">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text} className="sid16">
          <NavLink
            to={path}
            className={({ isActive }) =>
              ["sid17", isActive ? "sid18" : "sid19", "sid23"].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className="sid20">{icon}</span>
            <span className={`sid22 ${isMobile ? "sid25" : "sid26"}`}>
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* ================= DESKTOP / TABLET SIDEBAR ================= */}
      <div className="sid1">
        {/* ===== Header ===== */}
        <div className="sid2">
          <div className="sid3">
            <div className="sid4">{initial}</div>
            <div>
              <h2 className="sid5">Hello, {username}!</h2>
              <p className="sid6">
                <Sparkle className="sid7" />
                let&apos;s crush some tasks!!!
              </p>
            </div>
          </div>
        </div>

        {/* ===== Content ===== */}
        <div className="sid8">
          {/* ===== Productivity ===== */}
          <div className="sid9">
            <div className="sid10">
              <h3 className="sid11">Productivity</h3>
              <span className="sid12">{productivity}%</span>
            </div>
            <div className="sid13">
              <div
                className="sid14"
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {/* ===== Menu ===== */}
          {renderMenuItems(false)}

          {/* ===== Tip ===== */}
          <div className="sid27">
            <div className="sid28">
              <div className="sid29">
                <div className="sid30">
                  <Lightbulb className="sid31" />
                </div>
                <div className="sid34">
                  <h4 className="sid35">Productivity Tip</h4>
                  <p className="sid36">
                    Break big tasks into smaller steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU BUTTON ================= */}
      {!mobileOpen && (
        <button className="sid38" onClick={() => setMobileOpen(true)}>
          <Menu className="sid39" />
        </button>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="sid40">
          <div className="sid41" onClick={() => setMobileOpen(false)} />
          <div className="sid42" onClick={(e) => e.stopPropagation()}>
            <div className="sid43">
              <h2 className="sid44">Menu</h2>
              <button className="sid45" onClick={() => setMobileOpen(false)}>
                <X className="sid39" />
              </button>
            </div>

            <div className="sid46">
              <div className="sid47">{initial}</div>
              <div>
                <h2 className="sid48">Hey, {username}</h2>
                <p className="sid49">
                  <Sparkles className="sid50" />
                  Let&apos;s crush some tasks!
                </p>
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;




