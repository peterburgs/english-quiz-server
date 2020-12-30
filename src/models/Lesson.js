// THIS MODEL IS DEPRECATED, NO USE ANYMORE
// ☠
const mongoose = require("mongoose");

// Schema
const lessonSchema = new mongoose.Schema({
  lessonOrder: {
    type: Number,
    required: true,
    unique: true,
  },
  topic: {
    type: mongoose.Types.ObjectId,
    ref: "Topic",
  },
  question: {
    type: mongoose.Types.ObjectId,
    ref: "Question",
  },
});

mongoose.model("Lesson", lessonSchema);
