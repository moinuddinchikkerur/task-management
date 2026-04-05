



/* ================= IMPORTS ================= */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";

import axios from "axios";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";

/* ================= CONSTANTS ================= */
const INITIAL_FORM = {
  email: "",
  password: "",
};

const fields = [
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: Lock,
    isPassword: true,
  },
];

/* ================= COMPONENT ================= */
const Login = ({ onSubmit, onSwitchMode }) => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const url = "http://localhost:4000";


  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post(
        `${url}/api/user/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (!data?.token || !data?.user?._id) {
        throw new Error("Invalid login response");
      }


      // ✅ SAVE USER WITH ROLE
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...data.user,
          role: data.user.role,
        })
      );


      /* ✅ SEND DATA TO APP */
      onSubmit?.({
        token: data.token,
        userId: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role, // ✅ PASS ROLE
      });


      toast.success("Login successful");

      setFormData(INITIAL_FORM);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };


  /* ================= JSX ================= */
  return (
    <div className="login-page">
      <div className="lo1">

        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />

        <div className="lo3">
          <div className="lo4">
            <LogIn className="lo5" />
          </div>

          <h2 className="lo6">Welcome Back</h2>
          <p className="lo7">
            Sign in to continue to TaskFlow
          </p>
        </div>


        <form onSubmit={handleSubmit} className="lo8">

          {fields.map(
            ({ name, type, placeholder, icon: Icon, isPassword }) => (

              <div className="Inputwrapper" key={name}>

                <Icon className="lo9" />

                <input
                  type={isPassword && showPassword ? "text" : type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [name]: e.target.value,
                    })
                  }
                  className="lo10"
                  required
                />

                {isPassword && (
                  <button
                    type="button"
                    className="lo11"
                    onClick={() =>
                      setShowPassword((p) => !p)
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                )}

              </div>

            )
          )}


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : (
                <>
                  <LogIn /> Login
                </>
              )
            }
          </button>


          {/* ADMIN LOGIN BUTTON */}
          <button
            type="button"
            className="login-btn admin-btn"
            onClick={() => navigate("/admin-login")}
          >
            Login as Admin
          </button>

        </form>


        <p className="lo18">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="lo19"
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
