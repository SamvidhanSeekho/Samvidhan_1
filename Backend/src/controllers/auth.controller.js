import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { createUserService, findUserByEmail } from "../services/auth.service.js";


// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Please try again shortly.",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUserService({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "MongooseServerSelectionError" ||
      error.name === "MongoServerSelectionError"
    ) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Please try again shortly.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ✅ SIGNIN
export const signin = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Please try again shortly.",
      });
    }

    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "MongooseServerSelectionError" ||
      error.name === "MongoServerSelectionError"
    ) {
      return res.status(503).json({
        success: false,
        message: "Database is unavailable. Please try again shortly.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};