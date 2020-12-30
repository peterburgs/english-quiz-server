const mongoose = require("mongoose");

// Schema
const levelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Level",
    },
    order: {
      type: Number,
      default: 0,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
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
