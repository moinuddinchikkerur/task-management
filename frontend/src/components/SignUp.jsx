



// src/components/SignUp.jsx

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../index.css";

/* ================= CONSTANT ================= */

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
};

const fields = [
  { name: "name", type: "text", placeholder: "Name", icon: UserPlus },
  { name: "email", type: "email", placeholder: "Email", icon: UserPlus },
  { name: "password", type: "password", placeholder: "Password", icon: UserPlus },
];

/* ================= COMPONENT ================= */

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const url = "https://task-management-l8em.onrender.com";

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${url}/api/user/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Signup failed");
      }

      // Reset form
      setFormData(INITIAL_FORM);

      toast.success("Signup successful. Please login.");

      // Switch to login after toast
      setTimeout(() => {
        onSwitchMode();
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="signup-page">

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
      />

      <div className="si1">

        {/* Header */}
        <div className="si2">

          <div className="si3">
            <UserPlus className="si4" />
          </div>

          <h2 className="si5">Create Account</h2>

          <p className="si6">
            Join TaskFlow to manage your tasks
          </p>

        </div>

        {/* Form */}
        <form className="si7" onSubmit={handleSubmit}>

          {fields.map(
            ({ name, type, placeholder, icon: Icon }) => (
              <div key={name} className="Inputwrapper">

                <Icon className="si8" />

                <input
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [name]: e.target.value,
                    })
                  }
                  className="si9"
                  required
                />

              </div>
            )
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >

            <UserPlus className="si10" />

            {loading ? "Signing Up..." : "Sign Up"}

          </button>

        </form>

        {/* Switch to Login */}
        <p className="si11">
          Already have an account?{" "}

          <button
            type="button"
            className="si12"
            onClick={onSwitchMode}
          >
            Login
          </button>

        </p>

      </div>
    </div>
  );
};

export default SignUp;
