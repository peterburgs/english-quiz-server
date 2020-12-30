const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Question = mongoose.model("Question");
const Pool = mongoose.model("Pool");
const { v1: uuidv1 } = require("uuid");

const router = express.Router();

// GET Method: Get all Questions
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/questions/",
  };
  const poolId = req.query.poolId ? req.query.poolId : null;
  const topicId = req.query.topicId ? req.query.topicId : null;
  let questions = null;
  try {
    if (poolId) {
      questions = await Question.find({
        pool: poolId,
        isRemoved: false,
      }).exec();
    }
    if (topicId) {
      questions = await Question.find({
        topic: topicId,
        isRemoved: false,
      }).exec();
    }
    if (!poolId && !topicId) {
      questions = await Question.find({
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
    if (result.length) {
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
router.post("/", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/questions/",
    // type of question
    type: {
      type: String,
      required: true,
    },
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
    singleSelectionAnswers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SingleSelectionAnswer",
      },
    ],
  };
  try {
    // Find the Pool that Question belongs to
    const pool = await Pool.findOne({ _id: req.body.pool }).exec();
    if (pool) {
      // Init question
      const question = new Question({
        type: req.body.type,
        imageUrl: req.body.imageUrl,
        questionText: req.body.questionText,
        questionRequirement: req.body.questionRequirement,
        pool: req.body.pool,
        isRemoved: req.body.isRemoved,
        singleSelection: req.body.singleSelection,
        translate: req.body.translate,
        arrange: req.body.arrange,
        code: uuidv1(),
      });
      // Save question
      const result = await question.save();
      pool.questions.push(result);
      await pool.save();

      // Response
      res.status(201).json({
        message: "New Question is created and saved to Pool!",
        question: result,
        pool: pool,
        requestForm,
      });
    } else {
      res.status(500).json({
        message: "Request form is missing fields",
        requestForm,
      });
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
