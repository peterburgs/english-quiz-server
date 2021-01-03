const mongoose = require("mongoose");

// Schema
const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Topic",
      unique: true,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "src/assets/avatar/defaultAvatar.jpg",
      required: true,
    },
    // Order is auto increased
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
      required: true,
    },
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true,
    },
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Topic", topicSchema);
