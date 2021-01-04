const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema(
  {
    userCredential: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCredential",
    },
    fullName: {
      type: String,
      default: "New Learner",
      required: false,
    },
    avatarUrl: {
      type: String,
      default: "../assets/avatar/defaultAvatar.jpg",
      required: false,
    },
    coin: {
      type: Number,
      default: 0,
      required: true,
    },
    exp: {
      type: Number,
      default: 0,
      required: true,
    },
    hasX2Exp: {
      type: Boolean,
      default: 0,
      required: true,
    },
    hasX5Exp: {
      type: Boolean,
      default: 0,
      required: true,
    },
    // progresses: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Progress",
    //   },
    // ],
  },
  { timestamps: true }
);

mongoose.model("User", userSchema);
