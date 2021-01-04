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
    const levels = await Level.find({ isRemoved: false }).populate({
      path: "topics",
      match: { isRemoved: false },
    });

    if (levels.length != 0) {
      res.status(200).json({
        message: "All Levels found!",
        levels,
        requestForm,
      });
    } else {
      res.status(200).json({
        message: "Empty level collection",
        levels: [],
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cannot find any Level!",
      err,
      requestForm,
    });
  }
});

//GET Method: get a specific level
router.get("/:levelId", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/levels/",
  };

  const id = req.params.levelId;

  try {
    const level = await Level.findOne({ _id: id, isRemoved: false });

    if (level) {
      res.status(200).json({
        message: "One level found!",
        level,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "Cannot find Level!",
        requestForm,
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "Cannot find any Level!",
      err,
      requestForm,
    });
  }
});

// POST Method: Create a new Level
router.post("/", async (req, res) => {
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
      unique: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };
  const level = new Level({
    name: req.body.name,
    order: req.body.order,
    requiredExp: req.body.requiredExp,
    isRemoved: req.body.isRemoved,
  });

  try {
    const result = await level.save();

    if (result) {
      res.status(201).json({
        message: "Level is create successfully!",
        level: result,
        requestForm,
      });
    } else {
      res.status(500).json({
        message: "Cannot create level!",
        level: result,
        requestForm,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Cannot create level!",
      err,
      requestForm,
    });
  }
});

// PUT Method: Edit a Level
router.put("/:levelId", async (req, res) => {
  const requestForm = {
    method: "PUT",
    url: "/levels/",
    name: {
      type: "String",
      default: "New Level",
    },
    order: {
      type: Number,
      default: 0,
      required: true,
      unique: true,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };

  const id = req.params.levelId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Level.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(201).json({
        message: "Updated",
        level: result,
        requestForm,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot edit",
      err: err.message,
      requestForm,
    });
  }
});

// Delete Method: Delete an existing Level
router.delete("/:levelId", async (req, res) => {
  const id = req.params.levelId;
  try {
    const result = await Level.findByIdAndUpdate(
      { _id: id },
      { $set: { isRemoved: true } }
    ).exec();
    if (result) {
      res.status(201).json({
        message: "Deleted",
        level: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot delete",
      err: err.message,
    });
  }
});
module.exports = router;
