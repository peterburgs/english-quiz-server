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
    default: 0,
  },
  isRemoved: {
    type: Boolean,
    default: false,
    required: true,
  },
  level: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
  },
});

mongoose.model("Topic", topicSchema);
