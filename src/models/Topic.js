const mongoose = require("mongoose");

// Schema
const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Topic",
    },
    imageUrl: {
      type: String,
      default: "srcassetsavatardefaultAvatar.jpg",
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
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
