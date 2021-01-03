const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Topic = mongoose.model("Topic");
const User = mongoose.model("User");
const Progress = mongoose.model("Progress");

const router = express.Router();

// POST Method: Create a new Progress
router.post("/", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/progresses/",
    completedLesson: {
      type: Number,
      default: 0,
      required: true,
    },
    topicId: {
      type: "String",
      ref: "Topic",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userTopic: {
      type: String,
      unique: true,
    },
  };
  try {
    const topic = await Topic.findOne({ _id: req.body.topicId });

    const user = await User.findOne({ _id: req.body.userId });

    const progress = new Progress({
      topic: topic._id,
      user: user._id,
      userTopic: user._id + topic._id,
      completedLesson: req.body.completedLesson,
    });

    const result = await progress.save();

    user.progresses.push(result);

    await user.save();
    if (result != null) {
      res.status(201).json({
        message: "New progress is created successfully!",
        progress: result,
        user,
        topic,
        requestForm,
      });
    } else {
      console.log("[progressRoutes.js] *error ");
      res.status(500).json({
        message: "Cannot create progress!",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[progressRoutes.js] ", err);
    res.status(500).json({
      message: "Cannot create progress!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
