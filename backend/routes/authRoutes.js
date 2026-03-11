const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  profile,
  logout,
  googleAuth,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes (require JWT)
router.get("/profile", protect, profile);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logout);

module.exports = router;
