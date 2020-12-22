const mongoose = require("mongoose");

// Schema
const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "New Topic",
  },
  imageUrl: {
    type: String,
    default: "src\assets\avatar\defaultAvatar.jpg",
  },
  order: {
    type: Number,
    required: true,
    unique: true
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  level: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    required: true
  },
});

mongoose.model("Topic", topicSchema);
