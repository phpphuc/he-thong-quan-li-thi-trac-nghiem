import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import axiosInstance from "../../../utils/axiosConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault(); // Ngăn reload trang khi submit form
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      // console.log(response.data.data);
      // Xử lý thành công
      login(response.data.data);
      // Điều hướng trang theo role tương ứng
      if (response.data.data.type === "STUDENT") {
        navigate("/sinhvien");
      } else if (response.data.data.type === "TEACHER") {
        navigate("/giangvien");
      } else if (response.data.data.type === "SCHOOLBOARD") {
        navigate("/bgh");
      }
    } catch (err) {
      // Xử lý lỗi
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Wrong email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      {/* Title in blue */}
      <h1 className="text-blue-500 text-2xl font-medium mb-16">
        Hệ thống quản lý thi trắc nghiệm
      </h1>

      {/* Login Container */}
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Login to your account
        </h2>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email"
            placeholder="Your school email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login now"}
          </button>

          {/* Forgot Password */}
          <div className="text-center text-sm text-gray-600">
            Forgot Your Password?{" "}
            <button type="button" className="text-blue-500 hover:text-blue-600">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
