const mongoose = require("mongoose");

// Schema
const questionSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    default: "srcassets\topicImages\1608569850175-meme.jpg",
  },
  questionText: {
    type: String,
    required: true,
  },
  questionRequirement: {
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
  singleSelection: {
    type: Array,
  },
  translate: {
    type: String,
  },
  arrange: {
    type: Array,
  },
  type: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  lessonOrder: {
    type: Number,
  },
  topic: {
    type: mongoose.Types.ObjectId,
    ref: "Topic",
  },
});

mongoose.model("Question", questionSchema);
