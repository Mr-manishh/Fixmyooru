const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

const parseCsvEnv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "https://fixmyooru.vercel.app",
  ...parseCsvEnv(process.env.FRONTEND_URL),
  ...parseCsvEnv(process.env.FRONTEND_URLS),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Allow Vercel preview deployments such as https://fixmyooru-git-main-*.vercel.app
  return /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);
};

const corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ─── Middleware ──────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
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
app.use("/api/admin", adminRoutes);

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
