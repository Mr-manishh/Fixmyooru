const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createAdminToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const normalizeStatus = (status) => {
  if (status === "Resolved") return "Completed";
  return status;
};

const getAllowedAdminEmails = () => {
  const raw = process.env.ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const isAllowedAdminEmail = (email) => {
  const allowed = getAllowedAdminEmails();
  if (allowed.length === 0) return true;
  return allowed.includes(email.toLowerCase());
};

const serializeAdmin = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  createdAt: admin.createdAt,
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase();
    if (!isAllowedAdminEmail(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        message: "This email is not authorized for admin signup.",
      });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account already exists for this email.",
      });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount >= 5) {
      return res.status(400).json({
        success: false,
        message: "Admin limit reached. Only 5 admins are allowed.",
      });
    }

    const admin = await Admin.create({ name, email: normalizedEmail, password });
    const token = createAdminToken(admin._id);

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully.",
      data: {
        token,
        admin: serializeAdmin(admin),
      },
    });
  } catch (error) {
    console.error("Admin signup error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide admin email and password.",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials." });
    }

    const token = createAdminToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      data: {
        token,
        admin: serializeAdmin(admin),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID.includes("your_google_client_id_here")
    ) {
      return res.status(500).json({
        success: false,
        message: "Google login is not configured on server.",
      });
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: "Unable to get email from Google account." });
    }

    const normalizedEmail = email.toLowerCase();
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      if (!isAllowedAdminEmail(normalizedEmail)) {
        return res.status(403).json({
          success: false,
          message: "This Google account is not authorized for admin access.",
        });
      }

      const adminCount = await Admin.countDocuments();
      if (adminCount >= 5) {
        return res.status(400).json({
          success: false,
          message: "Admin limit reached. Only 5 admins are allowed.",
        });
      }

      admin = await Admin.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: crypto.randomBytes(24).toString("hex"),
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: "Admin account is inactive." });
    }

    const token = createAdminToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Admin Google authentication successful.",
      data: {
        token,
        admin: serializeAdmin(admin),
      },
    });
  } catch (error) {
    console.error("Admin Google auth error:", error.message);
    return res.status(500).json({ success: false, message: "Google authentication failed." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your admin email address.",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    if (!admin) {
      return res.status(200).json({
        success: true,
        message: "If an admin account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${req.headers.origin || "http://localhost:3000"}/admin/reset-password/${resetToken}`;

    try {
      const sendEmail = require("../utils/sendEmail");
      await sendEmail({
        to: admin.email,
        subject: "FixMyOoru Admin Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">Admin Password Reset</h2>
            <p>You requested a password reset for your admin account.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #4f46e5; color: #fff; text-decoration: none; margin: 16px 0;">Reset Password</a>
            <p style="color: #64748b;">This link expires in 15 minutes.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.log(`Admin reset link for ${admin.email}: ${resetUrl}`);
    }

    return res.status(200).json({
      success: true,
      message: "If an admin account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Please provide a new password." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Admin password reset successful. You can now sign in.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin profile fetched successfully.",
    data: {
      admin: serializeAdmin(req.admin),
    },
  });
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalComplaints, pendingComplaints, inProgressComplaints, completedComplaints, totalUsers] =
      await Promise.all([
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: "Pending" }),
        Complaint.countDocuments({ status: "In Progress" }),
        Complaint.countDocuments({ status: { $in: ["Completed", "Resolved"] } }),
        User.countDocuments(),
      ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard stats fetched successfully.",
      data: {
        stats: {
          totalComplaints,
          pendingComplaints,
          inProgressComplaints,
          resolvedComplaints: completedComplaints,
          totalUsers,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { sortBy = "createdAt", order = "desc", status = "All" } = req.query;

    const allowedSortBy = ["createdAt", "title", "category", "status", "location"];
    const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";
    const safeOrder = order === "asc" ? 1 : -1;

    const filter = {};
    if (status !== "All") {
      filter.status = status === "Completed" ? { $in: ["Completed", "Resolved"] } : status;
    }

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .sort({ [safeSortBy]: safeOrder });

    const normalized = complaints.map((complaint) => {
      const item = complaint.toObject();
      item.status = normalizeStatus(item.status);
      return item;
    });

    return res.status(200).json({
      success: true,
      message: "All complaints fetched successfully.",
      data: { complaints: normalized },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email createdAt").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: {
        users,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    const allowedStatuses = ["Pending", "In Progress", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    const complaint = await Complaint.findById(id).populate("user", "name email");
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    complaint.status = status;

    const updateMessage =
      message?.trim() || `Your complaint regarding ${complaint.title} is now ${status}.`;

    complaint.updates = complaint.updates || [];
    complaint.updates.push({
      status,
      message: updateMessage,
      sentAt: new Date(),
      sentBy: req.admin._id,
    });

    await complaint.save();

    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS && complaint.user?.email) {
        const sendEmail = require("../utils/sendEmail");
        await sendEmail({
          to: complaint.user.email,
          subject: "FixMyOoru Complaint Update",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #4f46e5;">Complaint Status Updated</h2>
              <p>Hello ${complaint.user.name || "Citizen"},</p>
              <p>${updateMessage}</p>
              <p style="margin-top: 16px; color: #64748b;">Thank you for helping improve your community with FixMyOoru.</p>
            </div>
          `,
        });
      } else {
        console.log(`User update for ${complaint.user?.email || "unknown"}: ${updateMessage}`);
      }
    } catch (mailError) {
      console.error("Failed to send status update email:", mailError.message);
    }

    const normalizedComplaint = complaint.toObject();
    normalizedComplaint.status = normalizeStatus(normalizedComplaint.status);

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      data: {
        complaint: normalizedComplaint,
        updateMessage,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
