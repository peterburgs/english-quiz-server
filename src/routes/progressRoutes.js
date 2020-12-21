const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Topic = mongoose.model("Topic");
const User = mongoose.model("User");
const Progress = mongoose.model("Progress");

const router = express.Router();

// POST Method: Create a new Progress
router.post("/", async (req, res) => {
  console.log("[progressRoutes.js] *req.body: ", req.body)

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
    }
  };
  const body = req.body;
  try {
    const topic = await Topic.findOne({ _id: body.topicId });
    console.log("[progressRoutes.js] *topic: ", topic)

    const user = await User.findOne({ _id: body.userId });
    console.log("[progressRoutes.js] *user: ", user)

    const progress = new Progress({
      topic: topic._id,
      user: user._id,
      userTopic: user._id + topic._id,
      completedLesson: body.completedLesson,
    });
    console.log("[progressRoutes.js] *progress: ", progress)

    const result = await progress.save();
    console.log("[progressRoutes.js] *result: ", result)

    user.progress.push(result);


    await user.save();
    console.log("[progressRoutes.js] *user: ", user)
    if (result != null) {
      res.status(201).json({
        message: "New progress is created successfully!",
        progress,
        user,
        topic,
        requestForm,
      });
    } else {
      console.log("[progressRoutes.js] *error ")

      res.status(500).json({
        message: "Cannot create progress!",
        requestForm,
      });
    }
  } catch (err) {

    console.log("[progressRoutes.js] ", err)
    res.status(500).json({
      message: "Cannot create progress!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
