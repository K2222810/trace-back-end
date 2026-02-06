const mongoose = require("mongoose");

const { Schema } = mongoose;

const checkInSchema = new Schema(
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
    date: {// changed to date instead of due date
      type: Date,
      default: Date.now,// added current date
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckIn", checkInSchema);
