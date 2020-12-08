const mongoose = require("mongoose");

// Schema
const levelSchema = new mongoose.Schema({
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
    required: true,
  },
  topics: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
    },
  ],
});

mongoose.model("Level", levelSchema);
