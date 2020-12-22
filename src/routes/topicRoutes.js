const express = require("express");
const mongoose = require("mongoose");

// For upload images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/topicImages");
  },
  filename: function (req, file, cb) {
    let name =
      String(new Date().getTime().toString()) +
      "-" +
      file.originalname;
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  // fileFilter: fileFilter
});

//
// Import Models
const Topic = mongoose.model("Topic");
const Level = mongoose.model("Level");

const router = express.Router();

//GET Method: get all topics
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
    console.log("[topicRoutes.js] *err: ", err);

    res.status(404).json({
      message: "Cannot find any Topic!",
      err,
      requestForm,
    });
  }
});

// POST Method: Create a new Topic
router.post("/", upload.single("topicImage"), async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/topics/",
    name: {
      type: "String",
      default: "New Topic",
    },
    imageUrl: {
      type: "String",
      default: "src\\assets\\defaultAvatar.jpg",
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true,
    },
  };

  try {
    const level = await Level.findOne({ _id: req.body.level });

    const topic = new Topic({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      isRemoved: req.body.isRemoved,
      order: req.body.order,
      level: level._id,
    });

    const result = await topic.save();
    level.topics.push(result);
    await level.save();

    res.status(201).json({
      message: "Create new topic successfully!",
      result,
      level,
      requestForm,
    });
  } catch (err) {
    console.log("[topicRoutes.js] *err");
    res.status(500).json({
      message: "Cannot create topic!",
      error: err.message,
      // requestForm,
      request: req.body,
    });
  }
});
module.exports = router;
