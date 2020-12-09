const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Level = mongoose.model("Level");
const router = express.Router();

//GET Method: get all levels
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/levels/",
  };
  try {
    const level = await Level.find();
    console.log("[levelRoutes.js : 15] *level: ", level)

    if (level.length != 0) {
      res.status(200).json({
        message: "All Levels found!",
        level,
        requestForm,
      });
    } else {
      console.log("[levelRoutes.js : 24] *error at levelRoutes.js ")

      res.status(404).json({
        message: "Cannot find any Level!",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[levelRoutes.js : 32] *err: ", err)

    res.status(404).json({
      message: "Cannot find any Level!",
      err,
      requestForm,
    });
  }
});

// POST Method: Create a new Level
router.post("/", async (req, res) => {
  console.log("[levelRoutes.js : 44] *req.body: ", req.body)

  const requestForm = {
    method: "POST",
    url: "/levels/",
    name: {
      type: "String",
      default: "New Level",
    },
    order: {
      type: Number,
      default: 0,
      required: true,
      unique: true
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };
  const body = req.body;
  const level = new Level({
    name: body.name,
    order: body.order,
    isRemoved: body.isRemoved,
  });
  console.log("[levelRoutes.js : 70] *level: ", level)

  try {
    const result = await level.save();
    console.log("[levelRoutes.js : 74] *result: ", result)

    if (result) {
      res.status(201).json({
        message: "Level is create successfully!",
        level: result,
        requestForm,
      });
    } else {
      console.log("[levelRoutes.js : 83] *error at levelRoutes.js ")
      res.status(500).json({
        message: "Cannot create level!",
        level: result,
        requestForm,
      });
    }
  } catch (err) {
    console.log("[levelRoutes.js : 91] *error: ", err)

    res.status(500).json({
      message: "Cannot create level!",
      err,
      requestForm,
    });
  }
});
module.exports = router;
