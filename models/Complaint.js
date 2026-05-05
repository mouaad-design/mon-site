const mongoose = require("mongoose");

const VALID_TYPES = ["message", "recommendation", "complaint"];
const VALID_STATUSES = ["pending", "in_progress", "resolved"];
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

const complaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    type: {
      type: String,
      enum: VALID_TYPES,
      required: true,
      default: "message"
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220
    },
    details: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    imageUrls: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: VALID_STATUSES,
      default: "pending",
      index: true
    },
    client: {
      type: String,
      trim: true,
      default: "stellantis"
    },
    line: {
      type: String,
      trim: true,
      default: ""
    },
    lineValue: {
      type: String,
      trim: true,
      default: ""
    },
    priority: {
      type: String,
      trim: true,
      default: "normal"
    },
    senderPhone: {
      type: String,
      trim: true,
      default: ""
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

complaintSchema.index({ createdAt: 1 }, { expireAfterSeconds: ONE_YEAR_SECONDS });

module.exports = mongoose.model("Complaint", complaintSchema);
module.exports.VALID_TYPES = VALID_TYPES;
module.exports.VALID_STATUSES = VALID_STATUSES;
