import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Shield,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

const Profile = ({ user, setCurrentUser, onLogout }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully");
  };

  return (
    <div className="pro1">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Back */}
      <button className="pro2" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Back to Dashboard
      </button>

      {/* Header */}
      <div className="pro3">
        <div className="pro4">{profile.name.charAt(0).toUpperCase()}</div>
        <div>
          <h1 className="pro5">Account Settings</h1>
          <p className="pro6">Manage your profile and security settings</p>
        </div>
      </div>

      {/* Content */}
      <div className="pro7">
        {/* Personal Info */}
        <div className="pro8">
          <h2 className="pro9">
            <User size={18} /> Personal Information
          </h2>

          <div className="pro10">
            <User size={16} />
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="Name"
            />
          </div>

          <div className="pro10">
            <Mail size={16} />
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Email"
            />
          </div>

          <button className="pro11" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </div>

        {/* Security */}
        <div className="pro8">
          <h2 className="pro9">
            <Shield size={18} /> Security
          </h2>

          {/* Current password with eye */}
          <div className="pro10">
            <Lock size={16} />
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <button
              type="button"
              className="pro15"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="pro10">
            <Lock size={16} />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
          </div>

          <div className="pro10">
            <Lock size={16} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
          </div>

          <button className="pro11" onClick={handleChangePassword}>
            Change Password
          </button>

          {/* Danger Zone */}
          <div className="pro12">
            <h3>Danger Zone</h3>
            <button className="pro13" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
