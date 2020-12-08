const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Topic = mongoose.model("Topic");
const Level = mongoose.model("Level");

const router = express.Router();

//GET Method: get all levels
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find();
    if (topics.length != 0) {
      res.status(200).json({
        message: "All Topics found!",
        topics: topics,
      });
    } else {
      res.status(404).json({
        message: "Cannot find any Topic!",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cannot find any Topic!",
      err,
    });
  }
});

// POST Method: Create a new Topic
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const level = await Level.findOne({ _id: req.body.levelId });
    const topic = new Topic({
      name: body.name,
      imageUrl: body.imageUrl,
      isRemoved: body.isRemoved,
      order: body.order,
      level: level._id,
    });
    const result = await topic.save();
    level.topics.push(result);
    await level.save();

    res.status(200).json({
      message: "Create new topic successfully!",
      result,
      level,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot create topic!",
      err,
    });
  }
});
module.exports = router;
