const mongoose = require("mongoose");

const { Schema } = mongoose;

const followUpSchema = new Schema(
  {
    application_id: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
    },
    note: {
      type: String,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", followUpSchema);
