const mongoose = require("mongoose");

// Schema
const userSchema = new mongoose.Schema({
  userCredentialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredential",
    required: true,
  },
  fullName: {
    type: String,
    default: "New Learner",
  },
  avatarUrl: {
    type: String,
    default: "../assets/defaultAvatar.jpg",
  },
  coin: {
    type: Number,
    default: 0,
  },
  currentLevel: {
    type: Number,
    default: 1,
  },
  dailyGoal: {
    type: Number,
    default: 0,
  },
  exp: {
    type: Number,
    default: 0,
  },
  isTurnOnNotification: {
    type: Boolean,
    default: true,
  },
  isTurnOnRemindingViaEmail: {
    type: Boolean,
    default: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
});

mongoose.model("User", userSchema);
