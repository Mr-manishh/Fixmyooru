const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Pothole",
          "Garbage",
          "Water Leak",
          "Broken Streetlight",
          "Drainage",
          "Road Damage",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Resolved"],
      default: "Pending",
    },
    updates: [
      {
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed", "Resolved"],
        },
        message: {
          type: String,
          trim: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        sentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by user and status
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });

// Remove __v from JSON
complaintSchema.methods.toJSON = function () {
  const complaint = this.toObject();
  delete complaint.__v;
  return complaint;
};

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
