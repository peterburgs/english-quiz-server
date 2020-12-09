const mongoose = require("mongoose");

// Schema
const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "New Level",
  },
  imageUrl: {
    type: String,
    default: "src\\assets\\defaultAvatar.jpg",
  },
  order: {
    type: Number,
    required: true,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  level: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
  },
});

mongoose.model("Topic", topicSchema);
