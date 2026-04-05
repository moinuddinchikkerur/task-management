import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  Lock,
  X,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import "../index.css";

const AdminProfile = () => {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  /* ================= STATES ================= */

  const [editMode, setEditMode] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");


  /* ================= TOAST ================= */

  const showMessage = (msg) => {
    setToastMsg(msg);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };


  /* ================= SAVE PROFILE ================= */

  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      name,
      email,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setEditMode(false);

    showMessage("Profile updated successfully!");
  };


  /* ================= CHANGE PASSWORD ================= */

  const handleChangePassword = () => {
    if (!oldPass || !newPass || !confirmPass) {
      showMessage("Please fill all fields");
      return;
    }

    if (newPass !== confirmPass) {
      showMessage("Passwords do not match");
      return;
    }

    showMessage("Password changed successfully!");

    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    setShowPasswordBox(false);
  };



  return (
    <div className="admin-profile-wrapper">


      {/* ================= BACK BUTTON ================= */}

      <button
        className="back-dashboard-btn"
        onClick={() => navigate("/admin")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>



      {/* ================= TOAST ================= */}

      {showToast && (
        <div className="custom-toast">
          <CheckCircle size={18} />
          {toastMsg}
        </div>
      )}



      {/* ================= PROFILE CARD ================= */}

      <div className="admin-profile-card">


        {/* HEADER */}

        <div className="profile-top">

          <div className="profile-avatar-lg">
            {name?.charAt(0).toUpperCase()}
          </div>

          <h2>{name}</h2>

          <span className="profile-role">
            <Shield size={14} />
            Administrator
          </span>

        </div>



        {/* ================= INFO ================= */}

        <div className="profile-info">


          {/* NAME */}

          <div className="profile-field">

            <User size={18} />

            {editMode ? (
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            ) : (
              <span>{name}</span>
            )}

          </div>



          {/* EMAIL */}

          <div className="profile-field">

            <Mail size={18} />

            {editMode ? (
              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            ) : (
              <span>{email}</span>
            )}

          </div>



          {/* ROLE */}

          <div className="profile-field">

            <Shield size={18} />

            <span>Admin</span>

          </div>

        </div>



        {/* ================= ACTIONS ================= */}

        <div className="profile-actions-center">

          {!editMode ? (
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              <Edit size={16} />
              Edit Profile
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Changes
            </button>
          )}

        </div>

      </div>



      {/* ================= SECURITY ================= */}

      <div className="security-box">

        <h3>
          <Lock size={18} />
          Security
        </h3>

        <p>Last login: Today</p>

        <p>Password: ********</p>

        <button
          className="change-pass-btn"
          onClick={() => setShowPasswordBox(true)}
        >
          Change Password
        </button>

      </div>



      {/* ================= PASSWORD MODAL ================= */}

      {showPasswordBox && (

        <div className="password-modal">

          <div className="password-box">


            <div className="modal-header">

              <h3>Change Password</h3>

              <X
                size={20}
                onClick={() =>
                  setShowPasswordBox(false)
                }
              />

            </div>



            <input
              type="password"
              placeholder="Old Password"
              value={oldPass}
              onChange={(e) =>
                setOldPass(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) =>
                setNewPass(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPass}
              onChange={(e) =>
                setConfirmPass(e.target.value)
              }
            />


            <button
              className="save-btn full-btn"
              onClick={handleChangePassword}
            >
              Update Password
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminProfile;
