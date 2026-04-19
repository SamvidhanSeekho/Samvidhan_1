import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../utils/authUtils";


const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.token && data.email && data.name && data.userId) {
      // Store authentication data in localStorage using utility function
      setAuthData(data.token, data.email, data.name, data.userId);
      navigate("/");
    } else {
      throw new Error("Invalid response from server");
    }

  } catch (err) {
    console.error("Login error:", err);
    setError(err.message);
  }
};

 return (
    <section className="px-8 py-16 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white">Welcome Back!</h1>
        <p className="mt-2 text-xl text-white">Please log in to your account</p>
      </div>

      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl"
        >
          {/* Error */}
          {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email} 
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Your Password"
              value={formData.password} 
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-indigo-500"
            />

            {/* Show/Hide Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-sm text-gray-600 right-4 top-4"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full p-4 text-white rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:scale-105"
          >
            Sign In
          </button>

          {/* Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/sign-up"
                className="font-semibold text-yellow-500 hover:text-yellow-800"
              >
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;