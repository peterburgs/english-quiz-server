const mongoose = require("mongoose");

// Schema
const levelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Level",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
      required: true,
    },
    requiredExp: {
      type: Number,
      required: true,
      default: 0,
    },
    topics: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Topic",
      },
    ],
  },
  { timestamps: true }
);

mongoose.model("Level", levelSchema);
