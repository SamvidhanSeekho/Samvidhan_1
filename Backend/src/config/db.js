import mongoose from "mongoose";
import dns from "dns";

const configureDnsResolvers = () => {
  const configured = process.env.MONGO_DNS_SERVERS;
  const resolvers = configured
    ? configured.split(",").map((server) => server.trim()).filter(Boolean)
    : ["8.8.8.8", "1.1.1.1"];

  if (resolvers.length > 0) {
    dns.setServers(resolvers);
  }
};

export const connectDB = async () => {
  try {
    configureDnsResolvers();

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("MongoDB Connected to samvidhanDB");
    return true;
  } catch (error) {
    console.error("DB Error:", error.message);
    console.log("Retrying MongoDB connection in 5 seconds...");

    // Keep API alive and retry so frontend does not get connection refused.
    setTimeout(() => {
      connectDB();
    }, 5000);

    return false;
  }
};