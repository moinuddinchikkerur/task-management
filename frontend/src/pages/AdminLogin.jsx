




// import React, { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import "react-toastify/dist/ReactToastify.css";
// import "../index.css";

// const AdminLogin = () => {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // ✅ NEW
//   const [loading, setLoading] = useState(false);


//   const handleSubmit = async (e) => {

//     e.preventDefault();
//     setLoading(true);

//     try {

//       const res = await axios.post(
//         "https://task-management-l8em.onrender.com/api/user/login",
//         { email, password }
//       );

//       const data = res.data;


//       // ✅ CHECK ADMIN
//       if (!data?.user || data.user.role !== "admin") {
//         toast.error("You are not an admin");
//         setLoading(false);
//         return;
//       }


//       // ✅ SAVE DATA
//       localStorage.setItem("token", data.token);

//       localStorage.setItem(
//         "currentUser",
//         JSON.stringify(data.user)
//       );


//       toast.success("Admin login successful");

//       window.location.href = "/admin";

//     } catch (err) {

//       toast.error(
//         err.response?.data?.message ||
//         "Admin login failed"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="login-page">

//       <ToastContainer position="top-center" autoClose={3000} />

//       <div className="lo1">

//         {/* ICON */}
//         <div className="lo4">
//           <Shield size={28} className="lo5" />
//         </div>


//         <h2 className="lo6">Admin Login</h2>

//         <p className="lo7">
//           Secure access for administrators
//         </p>


//         <form onSubmit={handleSubmit} className="lo8">


//           {/* EMAIL */}
//           <div className="Inputwrapper">

//             <Mail className="lo9" />

//             <input
//               type="email"
//               placeholder="Admin Email"
//               className="lo10"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />

//           </div>


//           {/* PASSWORD */}
//           <div className="Inputwrapper">

//             <Lock className="lo9" />

//             <input
//               type={showPassword ? "text" : "password"} // ✅ TOGGLE
//               placeholder="Password"
//               className="lo10"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             {/* 👁 EYE BUTTON */}
//             <button
//               type="button"
//               className="lo11"
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>

//           </div>


//           {/* LOGIN BUTTON */}
//           <button
//             type="submit"
//             className="login-btn"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Login as Admin"}
//           </button>


//           {/* BACK BUTTON */}
//           <button
//             type="button"
//             className="login-btn back-btn"
//             onClick={() => navigate("/login")}
//           >
//             ← Back to Login
//           </button>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default AdminLogin;




import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Mail, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "../index.css";

const AdminLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  /* ================= LOGIN ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await axios.post(
        "https://task-management-l8em.onrender.com/api/user/login",
        { email, password }
      );

      const data = res.data;


      // ❌ Not admin
      if (!data?.user || data.user.role !== "admin") {
        toast.error("You are not an admin");
        setLoading(false);
        return;
      }


      // ✅ SAVE DATA
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );


      toast.success("Admin login successful");


      // ✅ REDIRECT PROPERLY (NO RELOAD)
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 500);

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Admin login failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page">

      <ToastContainer position="top-center" autoClose={3000} />

      <div className="lo1">

        {/* ICON */}
        <div className="lo4">
          <Shield size={28} className="lo5" />
        </div>


        <h2 className="lo6">Admin Login</h2>

        <p className="lo7">
          Secure access for administrators
        </p>


        <form onSubmit={handleSubmit} className="lo8">


          {/* EMAIL */}
          <div className="Inputwrapper">

            <Mail className="lo9" />

            <input
              type="email"
              placeholder="Admin Email"
              className="lo10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* PASSWORD */}
          <div className="Inputwrapper">

            <Lock className="lo9" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="lo10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* 👁 EYE BUTTON */}
            <button
              type="button"
              className="lo11"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>

          </div>


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>


          {/* BACK */}
          <button
            type="button"
            className="login-btn back-btn"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;
