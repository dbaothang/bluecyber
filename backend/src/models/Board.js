const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "My Task Board",
  },
  description: {
    type: String,
    default: "",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

module.exports = mongoose.model("Board", boardSchema);
