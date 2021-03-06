const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Import Models
const Question = mongoose.model("Question");
const Pool = mongoose.model("Pool");

const router = express.Router();

// For upload images
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/questionImages");
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

// GET Method: Get all Questions
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/questions/",
  };
  const poolId = req.query.poolId ? req.query.poolId : null;
  const topicId = req.query.topicId ? req.query.topicId : null;
  const lessonOrder = req.query.lessonOrder ? req.query.lessonOrder : null;
  let questions = [];
  try {
    if (poolId && !topicId && !lessonOrder) {
      questions = await Question.find({
        pool: poolId,
        isRemoved: false,
      }).exec();
    } else if (!poolId && topicId && !lessonOrder) {
      questions = await Question.find({
        topic: topicId,
        isRemoved: false,
      }).exec();
    } else if (!poolId && topicId && lessonOrder) {
      questions = await Question.find({
        topic: topicId,
        lessonOrder: lessonOrder,
        isRemoved: false,
      }).exec();
    }
    if (questions.length != 0) {
      res.status(200).json({
        message: "All questions found!",
        questions,
        requestForm,
      });
    } else {
      res.status(200).json({
        message: "No document found!",
        questions: [],
        requestForm,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "No document found!!",
      requestForm,
    });
  }
});

// GET Method: Get a specific Question
router.get("/:questionId", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/questions/questionId",
  };
  try {
    const id = req.params.questionId;
    const result = await Question.findOne({ _id: id });
    if (result) {
      res.status(200).json({
        message: "Question Found!",
        question: result,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "No document found!!",
        requestForm,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "No document found!!",
      requestForm,
    });
  }
});

// POST Method: Create a new Question
router.post("/", upload.single("questionImage"), async (req, res) => {
  try {
    // Find the Pool that Question belongs to
    const pool = await Pool.findOne({ _id: req.body.pool }).exec();
    let url = null;
    if (req.file) {
      url = "/questionImages/" + req.file.filename;
    }
    if (pool) {
      // decode
      let singleSelection = [];
      if (req.body.singleSelection) {
        singleSelection = [...JSON.parse(req.body.singleSelection)];
      }
      let arrange = [];
      if (req.body.arrange) {
        arrange = [...JSON.parse(req.body.arrange)];
      }
      let translate = [];
      if (req.body.translate) {
        translate = [...JSON.parse(req.body.translate)];
      }

      const questionLength = await (await Question.find().exec()).length;

      // Init question
      const question = new Question({
        type: req.body.type,
        imageUrl: url,
        questionText: req.body.questionText,
        questionRequirement: req.body.questionRequirement,
        pool: req.body.pool,
        isRemoved: req.body.isRemoved,
        difficulty: req.body.difficulty,
        singleSelection,
        translate,
        arrange,
        code: `Q-${questionLength + 1}`,
      });
      // Save question
      const result = await question.save();
      pool.questions.push(result);
      await pool.save();

      // Response
      res.status(201).json({
        message: "New Question is created and saved to Pool!",
        question: result,
        pool,
      });
    } else {
      res.status(500).json({
        message: "Request form is missing fields",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cannot create Question!",
      err,
    });
  }
});

// GET Method: get image of question
// <== Magic route
router.get("/questionImages/:imageName", async (req, res) => {
  const imageName = req.params.imageName;
  const options = {
    root: path.join(__dirname, "../assets/questionImages"),
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

// PUT Method: Update an existing question
router.put("/:questionId", upload.single("questionImage"), async (req, res) => {
  try {
    const questionId = req.params.questionId;

    let singleSelection = [];
    if (req.body.singleSelection) {
      singleSelection = [...JSON.parse(req.body.singleSelection)];
    }
    let arrange = [];
    if (req.body.arrange) {
      arrange = [...JSON.parse(req.body.arrange)];
    }
    let translate = [];
    if (req.body.translate) {
      translate = [...JSON.parse(req.body.translate)];
    }

    // Update options
    const updateOps = {};
    for (const [key, val] of Object.entries(req.body)) {
      if (
        key !== "questionImages" &&
        key !== "singleSelection" &&
        key !== "arrange" &&
        key !== "translate"
      ) {
        updateOps[key] = val;
      }
    }

    updateOps["singleSelection"] = singleSelection;
    updateOps["translate"] = translate;
    updateOps["arrange"] = arrange;

    if (req.file) {
      const url = "/questionImages/" + req.file.filename;
      updateOps["questionImages"] = url;
    }

    // Find and update
    const result = await Question.findByIdAndUpdate(
      { _id: questionId },
      { $set: updateOps },
      { new: true, useFindAndModify: true }
    ).exec();

    if (result) {
      res.status(200).json({
        message: "Updated",
        question: result,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cannot update",
      err: err.message,
    });
  }
});

// Delete Method: Delete an existing Level
router.delete("/:questionId", async (req, res) => {
  const id = req.params.questionId;
  try {
    const result = await Question.findByIdAndUpdate(
      { _id: id },
      { $set: { isRemoved: true } }
    ).exec();
    if (result) {
      res.status(201).json({
        message: "Deleted",
        question: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot delete",
      err: err.message,
    });
  }
});

// Export
module.exports = router;
