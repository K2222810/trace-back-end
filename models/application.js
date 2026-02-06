const mongoose = require("mongoose");

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      enum: [
        "tech",
        "fintech",
        "medtech",
        "edtech",
        "ecom",
        "media",
        "startup",
        "other",
      ],
      default: "other",
    },
    status: {
      type: String,
      enum: [
        "applied",
        "working",
        "interviewing",
        "offer",
        "rejected",
        "withdrawn",
        "bookmark",
      ],
      required: true,
      default: "applied",
    },
    appliedDate: {
      type: Date,
    },
    location: {
      type: String,
    },
    salaryRange: {
      type: String,
    },
    furtherDetails: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
