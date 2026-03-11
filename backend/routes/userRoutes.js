const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/auth");

// All routes here require authentication
router.use(protect);

// Profile
router.get("/profile", authController.getProfile);
router.put("/profile", authController.updateProfile);

// Account
router.get("/me", authController.getMe);
router.put("/change-password", authController.changePassword);
router.post("/logout", authController.logout);

module.exports = router;
