const mongoose = require("mongoose");

const { Schema } = mongoose;

const followUpSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {// changed this to due date because we need to track the follow ups
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FollowUp", followUpSchema);
