const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    matricule: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    passed: {
      type: Boolean,
      required: true,
      index: true
    },
    client: {
      type: String,
      trim: true,
      default: "stellantis"
    },
    language: {
      type: String,
      trim: true,
      default: "fr"
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

module.exports = mongoose.model("QuizResult", quizResultSchema);
