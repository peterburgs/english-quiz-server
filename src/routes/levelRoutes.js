const express = require("express");
const mongoose = require("mongoose");
// Import Models
const Level = mongoose.model("Level");
const router = express.Router();

//GET Method: get all levels
router.get("/", async (req, res) => {
  try {
    const level = await Level.find();
    if (level.length != 0) {
      res.status(200).json({
        message: "All Levels found!",
        level,
      });
    } else {
      res.status(404).json({
        message: "Cannot find any Level!",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cannot find any Level!",
      err,
    });
  }
});

// POST Method: Create a new Level
router.post("/", async (req, res) => {
  const body = req.body;
  const level = new Level({
    name: body.name,
    order: body.order,
    isRemoved: body.isRemoved,
  });
  try {
    const result = await level.save();
    if (result) {
      console.log("Level is create successfully!", result);
      res.status(201).json({
        message: "Level is create successfully!",
        level: result,
      });
    } else {
      res.status(500).json({
        message: "Cannot create level!",
        level: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot create level!",
      err,
    });
  }
});
module.exports = router;
