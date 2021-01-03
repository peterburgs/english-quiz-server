const mongoose = require("mongoose");

// Schema
const poolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Pool",
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
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

mongoose.model("Pool", poolSchema);
