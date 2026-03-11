const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createComplaint,
  getMyComplaints,
  getStats,
  getComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");

// All complaint routes require authentication
router.use(protect);

router.post("/", createComplaint);
router.get("/", getMyComplaints);
router.get("/stats", getStats);
router.get("/:id", getComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;
