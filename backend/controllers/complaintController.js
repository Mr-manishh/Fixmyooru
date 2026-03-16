const Complaint = require("../models/Complaint");

// ─── POST /api/complaints — Create Complaint ────────────
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location, image } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, category and location.",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      image: image || "",
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully.",
      data: { complaint },
    });
  } catch (error) {
    // Handle Mongoose validation errors nicely
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    console.error("Create Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── GET /api/complaints — Get User's Complaints ────────
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    const pageNumber = Number.parseInt(page, 10);
    const limitNumber = Number.parseInt(limit, 10);
    const safePage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
    const safeLimit = Number.isFinite(limitNumber) && limitNumber > 0 ? limitNumber : 20;

    const filter = { user: req.user._id };
    if (status && status !== "All") {
      filter.status = status === "Completed" ? { $in: ["Completed", "Resolved"] } : status;
    }

    const skip = (safePage - 1) * safeLimit;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Complaint.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: "Complaints fetched successfully.",
      data: {
        complaints,
        pagination: {
          total,
          page: safePage,
          pages: Math.ceil(total / safeLimit),
        },
      },
    });
  } catch (error) {
    console.error("Get Complaints Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── GET /api/complaints/stats — Get Complaint Stats ────
exports.getStats = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    const userId = req.user._id;

    const [total, pending, inProgress, completed] = await Promise.all([
      Complaint.countDocuments({ user: userId }),
      Complaint.countDocuments({ user: userId, status: "Pending" }),
      Complaint.countDocuments({ user: userId, status: "In Progress" }),
      Complaint.countDocuments({ user: userId, status: { $in: ["Completed", "Resolved"] } }),
    ]);

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully.",
      data: {
        stats: { total, pending, inProgress, completed, resolved: completed },
      },
    });
  } catch (error) {
    console.error("Get Stats Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── GET /api/complaints/:id — Get Single Complaint ─────
exports.getComplaint = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint fetched successfully.",
      data: { complaint },
    });
  } catch (error) {
    console.error("Get Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ─── DELETE /api/complaints/:id — Delete Complaint ──────
exports.deleteComplaint = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized request." });
    }

    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
      data: {},
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
