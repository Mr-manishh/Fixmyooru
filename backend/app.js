const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// ─── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FixMy Backend API is running.",
  });
});

// ─── API Routes ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", authRoutes);
app.use("/api/complaints", complaintRoutes);

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
});

module.exports = app;
