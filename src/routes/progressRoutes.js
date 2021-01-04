const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
// Import Models
const Topic = mongoose.model("Topic");
const User = mongoose.model("User");
const Progress = mongoose.model("Progress");

const router = express.Router();

// GET Method: get all progresses by UserId
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const progresses = await Progress.find({ user: userId });
    if (progresses) {
      res.status(200).json({
        message: "Done",
        progresses,
      });
    } else {
      res.status(404).json({
        message: "Not found",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Not found",
    });
  }
});

// POST Method: Create a new Progress
router.post("/", async (req, res) => {
  try {
    const progress = new Progress({
      topic: req.body.topicId,
      user: req.body.userId,
      completedLesson: req.body.completedLesson,
    });
    //still correct
    const result = await progress.save();
    //
    if (result) {
      res.status(201).json({
        message: "New progress is created successfully!",
        progress: result,
      });
    } else {
      console.log("[progressRoutes.js] *error ");
      res.status(500).json({
        message: "Cannot create progress!",
      });
    }
  } catch (err) {
    console.log("[progressRoutes.js] ", err);
    res.status(500).json({
      message: "Cannot create progress!",
      err,
    });
  }
});

// PUT method:update completed lesson
router.put("/:progressId", async (req, res) => {
  const progressId = req.params.progressId;
  // LessonOrder is the lesson user have just taken
  const lessonOrder = req.body.lessonOrder;
  try {
    const result = await Progress.findByIdAndUpdate(
      { _id: progressId },
      { $set: { completedLesson: lessonOrder } },
      { new: true }
    ).exec();
    if (result) {
      res.status(200).json({
        message: "Updated",
        progresses: result,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Cannot update",
    });
  }
});
module.exports = router;
