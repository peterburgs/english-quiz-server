const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Question = mongoose.model("Question");
const Pool = mongoose.model("Pool");

const router = express.Router();
// GET Method: Get all Questions
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/questions/",
  };
  const questions = await Question.find({});
  if (questions.length != 0) {
    res.status(200).json({
      message: "Found!",
      questions: questions,
      requestForm,
    });
  } else {
    res.status(404).json({
      message: "No document found!",
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
    const result = await Question.find({ _id: id });
    if (result.length) {
      res.status(200).json({
        message: "Found!",
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
    console.log(err.message)
    res.status(500).json({
      message: "No document found!!",
      requestForm,
    });
  }

});

// POST Method: Create a new Question
router.post("/", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/questions/",
    questionMedia: {
      type: String,
      default: "srcassets\topicImages\1608569850175-meme.jpg",
    },
    questionText: {
      type: String,
      required: true,
    },
    pool: {
      type: mongoose.Types.ObjectId,
      ref: "Pool",
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };
  try {
    // Find the Pool that Question belongs to
    const pool = await Pool.findOne({ _id: req.body.pool });
    if (pool) {
      // Init question
      const question = new Question({
        questionMedia: req.body.questionMedia,
        questionText: req.body.questionText,
        pool: req.body.pool,
        isRemoved: req.body.isRemoved,
      });
      // Save question
      const result = await question.save();
      if (result != null) {
        res.status(201).json({
          message: "New Question is created successfully!",
          question: question,
          pool: pool,
          requestForm,
        });
      } else {
        res.status(500).json({
          message: "Cannot create Question!",
          requestForm,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot create Question!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
