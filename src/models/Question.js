const mongoose = require("mongoose");

// Schema
const questionSchema = new mongoose.Schema({
  questionMedia: {
    type: String,
    default: "src\assets\topicImages\1608569850175-meme.jpg",
  },
  questionText: {
    type: String,
    required: true
  },
  pool: {
    type: mongoose.Types.ObjectId,
    ref: "Pool",
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
});

mongoose.model("Question", questionSchema);
