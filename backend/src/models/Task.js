const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "New Task",
  },
  description: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "📝",
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "wont-do"],
    default: "in-progress",
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
