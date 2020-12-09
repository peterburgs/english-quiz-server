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
  };
  const body = req.body;
  try {
    const topic = await Topic.findOne({ _id: body.topicId });
    const user = await User.findOne({ _id: body.userId });
    const progress = new Progress({
      topic: topic._id,
      user: user._id,
      completedLesson: body.completedLesson,
    });
    const result = await progress.save();
    user.progress.push(result);
    await user.save();
    if (result != null) {
      res.status(200).json({
        message: "New progress is created successfully!",
        progress,
        user,
        topic,
        requestForm,
      });
    } else {
      res.status(500).json({
        message: "Cannot create progress!",
        requestForm,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot create progress!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
