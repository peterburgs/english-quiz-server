const mongoose = require("mongoose");

// Schema
const questionSchema = new mongoose.Schema({
  questionMedia: {
    type: String,
    default: "srcassets\topicImages\1608569850175-meme.jpg",
  },
  questionText: {
    type: String,
    required: true,
  },
  pool: {
    type: mongoose.Types.ObjectId,
    ref: "Pool",
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  singleSelectionAnswers: {
    type: Array,
  },
  fillInBlankAnswers: {
    type: String,
  },
  arrangeAnswers: {
    type: Array,
  },
  type: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  topic: {
    type: mongoose.Types.ObjectId,
    ref: "Topic",
  },
});

mongoose.model("Question", questionSchema);
