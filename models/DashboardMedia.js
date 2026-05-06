const mongoose = require("mongoose");

const dashboardMediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    publicId: {
      type: String,
      required: true,
      trim: true
    },
    resourceType: {
      type: String,
      enum: ["image", "video"],
      required: true
    },
    mimeType: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("DashboardMedia", dashboardMediaSchema);
