const express = require("express");
const router = express.Router();
const adminProtect = require("../middleware/adminAuth");
const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getProfile,
  getDashboardStats,
  getAllComplaints,
  updateComplaintStatus,
  getUsers,
} = require("../controllers/adminController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.use(adminProtect);

router.get("/profile", getProfile);
router.get("/stats", getDashboardStats);
router.get("/complaints", getAllComplaints);
router.get("/users", getUsers);
router.put("/update-complaint/:id", updateComplaintStatus);

module.exports = router;
