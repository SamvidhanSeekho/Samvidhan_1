import express from "express";
import contactRoutes from "./routes/contact.routes.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";



const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

export default app;