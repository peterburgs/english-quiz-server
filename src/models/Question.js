const mongoose = require("mongoose");

// Schema
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    questionRequirement: {
      type: String,
      required: true,
    },
    pool: {
      type: mongoose.Types.ObjectId,
      ref: "Pool",
      required: false,
    },
    imageUrl: {
      type: String,
      default: "srcassets\topicImages\1608569850175-meme.jpg",
      required: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
      required: true,
    },
    // 3 types of question:singleSelection, translate & arrange
    singleSelection: {
      type: Array,
      required: false,
    },
    translate: {
      type: Array,
      required: false,
    },
    arrange: {
      type: Array,
      required: false,
    },
    //
    type: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    // lessonOrder only added when clone question from Pool to Topic
    lessonOrder: {
      type: Number,
      required: false,
    },
    topic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
      required: false,
    },
  },
  { timestamps: true }
);

mongoose.model("Question", questionSchema);
