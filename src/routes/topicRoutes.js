const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Topic = mongoose.model("Topic");
const Level = mongoose.model("Level");

const router = express.Router();

//GET Method: get all levels
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/topics/",
    name: {
      type: "String",
      default: "New Level",
    },
    imageUrl: {
      type: "String",
      default: "src\\assets\\defaultAvatar.jpg",
    },
    order: {
      type: Number,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
    },
  };
  try {
    const topics = await Topic.find();
    if (topics.length != 0) {
      res.status(200).json({
        message: "All Topics found!",
        topics: topics,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "Cannot find any Topic!",
        requestForm,
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cannot find any Topic!",
      err,
      requestForm,
    });
  }
});

// POST Method: Create a new Topic
router.post("/", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/topics/",
    name: {
      type: "String",
      default: "New Level",
    },
    imageUrl: {
      type: "String",
      default: "src\\assets\\defaultAvatar.jpg",
    },
    order: {
      type: Number,
      required: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    levelId: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
    },
  };
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
      requestForm,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot create topic!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
