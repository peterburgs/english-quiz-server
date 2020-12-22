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
});

mongoose.model("Pool", poolSchema);
