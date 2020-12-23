const mongoose = require("mongoose");

// Schema
const poolSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "New Pool",
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  questions: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Question",
    },
  ],
});

mongoose.model("Pool", poolSchema);
