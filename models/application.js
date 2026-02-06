const mongoose = require("mongoose");

const { Schema } = mongoose;

const applicationSchema = new Schema(
  {
    user_id: {
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
      required: true,
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
