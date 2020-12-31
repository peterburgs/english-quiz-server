const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const _ = require("lodash");
// For upload images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/topicImages");
  },
  filename: function (req, file, cb) {
    let extension = file.mimetype;
    let tag = "." + extension.split("/")[1];
    const currentDate = new Date().getTime();
    let name = String(currentDate).replace(":", "-") + tag;
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

//
// Import Models
const Question = mongoose.model("Question");
const Topic = mongoose.model("Topic");
const Level = mongoose.model("Level");

const router = express.Router();

//GET Method: get all topics
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/topics/",
  };
  try {
    const topics = await Topic.find({ isRemoved: false }).populate("level");
    const allTopics = await Topic.find();
    if (topics.length != 0) {
      res.status(200).json({
        message: "All Topics found!",
        topics: topics,
        count: allTopics.length,
        requestForm,
      });
    } else {
      res.status(200).json({
        message: "Cannot find any Topic!",
        requestForm,
        topics: [],
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

//GET Method: get a specific topic
router.get("/:topicId", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/topics/",
  };
  try {
    const id = req.params.topicId;
    const topic = await Topic.findOne({ _id: id }).populate("level");
    if (topic.length != 0) {
      res.status(200).json({
        message: "Topic Found!",
        topic,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "Cannot find Topic!",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[topicRoutes.js] *err: ", err);
    res.status(404).json({
      message: "Cannot find Topic!",
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
    topicImage: {
      type: "Image File",
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
    const url = "/topicImages/" + req.file.filename;
    const topic = new Topic({
      name: req.body.name,
      imageUrl: url,
      isRemoved: req.body.isRemoved,
      order: req.body.order,
      level: level._id,
    });
    const result = await topic.save();
    level.topics.push(result);
    await level.save();

    res.status(201).json({
      message: "Create new topic successfully!",
      topic: result,
      level,
      requestForm,
    });
  } catch (err) {
    console.log("[topicRoutes.js] *err", err);
    res.status(500).json({
      message: "Cannot create topic!",
      error: err.message,
      // requestForm,
      request: req.body,
    });
  }
});

// GET Method: get image of topic
// <== Magic route
router.get("/topicImages/:imageName", async (req, res) => {
  const imageName = req.params.imageName;
  const options = {
    root: path.join(__dirname, "../assets/topicImages"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };
  res.sendFile(imageName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent:", imageName);
    }
  });
});

// PUT Method: update an existing topic
router.put("/edit/:topicId", upload.single("topicImage"), async (req, res) => {
  const requestForm = {
    method: "PUT",
    url: "/topics/edit/:topicId",
    name: {
      type: "String",
      default: "New Topic",
    },
    topicImage: {
      type: "Image File",
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
    // Deprecated ID need to change
    oldLevel: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true,
    },
    // Id of new level you want to update
    level: {
      type: mongoose.Types.ObjectId,
      ref: "Level",
      required: true,
    },
  };
  try {
    const id = req.params.topicId;
    const oldLevel = await Level.findOne({
      _id: req.body.oldLevel,
    });
    const level = await Level.findOne({
      _id: req.body.level,
    });

    // Update options
    const updateOps = {};
    for (const [key, val] of Object.entries(req.body)) {
      if (key != "oldLevel" && key !== "topicImage") {
        updateOps[key] = val;
      }
    }
    if (req.file) {
      const url = "/topicImages/" + req.file.filename;
      updateOps["imageUrl"] = url;
    }
    // Find and update
    const result = await Topic.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true, useFindAndModify: true }
    )
      .populate("level")
      .exec();

    if (result) {
      const index = oldLevel.topics.findIndex((e) => {
        return e == id;
      });
      if (index > -1) {
        oldLevel.topics.splice(index, 1);
        await oldLevel.save();
        await level.topics.push(result);
        await level.save();
        res.status(200).json({ message: "Updated", topic: result });
      } else {
        res.status(500).json({
          message: "Cannot update",
          requestForm,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cannot update",
      err: err.message,
    });
  }
});

// POST Method: add questions to topic
router.post("/edit", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/topics/edit",
    // Id of topic
    topic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Question",
      },
    ],
  };
  try {
    console.log(req.body);
    let tempQuestions = req.body.questions;
    const topic = await Topic.findOne({ _id: req.body.topic }).exec();

    // Clone new questions from request
    for (let i = 0; i < tempQuestions.length; i++) {
      const question = await Question.findOne({
        _id: tempQuestions[i].question,
      });
      let clonedQuestion = new Question({
        ..._.pick(question, [
          "isRemoved",
          "imageUrl",
          "singleSelection",
          "arrange",
          "translate",
          "questionText",
          "questionRequirement",
          "type",
          "code",
        ]),
        topic: topic._id,
        lessonOrder: tempQuestions[i].lessonOrder,
      });
      const result = await clonedQuestion.save();
      topic.questions.push(result);
      await topic.save();
    }
    //
    res.status(201).json({
      message: "Add questions to topic successfully!",
      requestForm,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Cannot execute",
      error: err.message,
    });
  }
});

// Export
module.exports = router;
