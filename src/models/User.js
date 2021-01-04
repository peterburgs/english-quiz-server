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
    currentLevelOrder: {
      type: Number,
      default: 1,
      required: true,
    },
    dailyGoal: {
      type: Number,
      default: 0,
      required: true,
    },
    exp: {
      type: Number,
      default: 0,
      required: true,
    },
    streak: {
      type: Number,
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
