import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("MongoDB Connected to samvidhanDB");
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};