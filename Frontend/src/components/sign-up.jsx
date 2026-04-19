import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../utils/authUtils";


const SignUp = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // State to handle success popup
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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    if (data.success) {
      // Auto-login user after signup
      if (data.token && data.userId && data.email && data.name) {
        setAuthData(data.token, data.email, data.name, data.userId);
      }
      
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2000);
    } else {
      throw new Error(data.message || "Signup failed");
    }

  } catch (err) {
    console.error("Signup error:", err);
    setError(err.message);
  }
};

return (
  <section className="px-8 py-16 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
    
    {/* Success Popup */}
    {success && (
      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        <div className="p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-green-600">Success!</h2>
          <p className="mt-2 text-gray-700">Account created successfully!</p>
          <p className="mt-2 text-gray-700">Redirecting to sign in page....</p>
        </div>
      </div>
    )}

    <div className="container mx-auto mb-12 text-center">
      <h1 className="text-4xl font-bold text-white">Create an Account</h1>
    </div>

    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg"
      >
        {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
        />

        {/* Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // ✅ FIX
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-sm text-gray-600 right-3 top-3"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full p-3 text-white rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-700"
        >
          Sign Up
        </button>

        {/* Sign-in Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-semibold text-yellow-500 hover:text-yellow-700"
            >
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  </section>
);
}
export default SignUp
