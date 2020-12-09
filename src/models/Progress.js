const mongoose = require("mongoose");

// Schema
const progressSchema = new mongoose.Schema({
  completedLesson: {
    type: Number,
    default: 0,
    required: true,
  },
  topic: {
    type: mongoose.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  userTopic: {
    type: String,
    unique: true,
  }
});

mongoose.model("Progress", progressSchema);
