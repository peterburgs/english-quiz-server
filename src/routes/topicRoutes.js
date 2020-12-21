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
    console.log("[topicRoutes.js] *topics: ", topics)

    if (topics.length != 0) {
      res.status(200).json({
        message: "All Topics found!",
        topics: topics,
        requestForm,
      });
    } else {
      console.log("[topicRoutes.js] *error: ")

      res.status(404).json({
        message: "Cannot find any Topic!",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[topicRoutes.js] *err: ", err)

    res.status(404).json({
      message: "Cannot find any Topic!",
      err,
      requestForm,
    });
  }
});

// POST Method: Create a new Topic
router.post("/", async (req, res) => {

  console.log("[topicRoutes.js] *req.body: ", req.body)

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
      unique: true
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true
    },
  };
  const body = req.body;
  try {
    const level = await Level.findOne({ _id: req.body.level });
    console.log("[topicRoutes.js] *level: ", level)

    const topic = new Topic({
      name: body.name,
      imageUrl: body.imageUrl,
      isRemoved: body.isRemoved,
      order: body.order,
      level: level._id,
    });
    console.log("[topicRoutes.js] *topic: ", topic)

    const result = await topic.save();
    level.topics.push(result);
    await level.save();
    console.log("[topicRoutes.js] *level: ", level)


    res.status(201).json({
      message: "Create new topic successfully!",
      result,
      level,
      requestForm,
    });
  } catch (err) {
    console.log("[topicRoutes.js] *err")
    res.status(500).json({
      message: "Cannot create topic!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
