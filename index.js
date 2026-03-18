import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./connection/connection.js";
import index from "./routes/index.route.js";

dotenv.config();

const app = express();

// ---------- BODY PARSER ----------
app.use(express.json());

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
//


// // static
// app.use("/upload", express.static("upload"));
app.use("/upload", express.static(path.join(process.cwd(), "upload")));

// DB
connectDB();

// ROUTES – all API routes start with /sp
app.use("/architecture", index);

// SERVER
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
