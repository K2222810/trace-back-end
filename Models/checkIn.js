const mongoose = require("mongoose");

const { Schema } = mongoose;

const checkInSchema = new Schema(
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
    dueDate: {
      type: Date,
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CheckIn", checkInSchema);
