const express = require("express");
const mongoose = require("mongoose");

// Import Models
const Pool = mongoose.model("Pool");

// Router
const router = express.Router();

//GET Method: get all pools
router.get("/", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/pools/",
    name: {
      type: String,
      default: "New Pool",
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };
  try {
    const pools = await Pool.find({});
    // If pools are found
    if (pools.length != 0) {
      res.status(200).json({
        message: "Found!",
        pools,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "No document found!",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[levelRoutes.js] *err: ", err);
    res.status(404).json({
      message: "No document found!",
      error: err.message,
      requestForm,
    });
  }
});

// POST Method: Create a new Pool
router.post("/", async (req, res) => {
  const requestForm = {
    method: "POST",
    url: "/pools/",
    name: {
      type: String,
      default: "New Pool",
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };
  const pool = new Pool({
    name: req.body.name,
    isRemoved: req.body.isRemoved,
  });
  try {
    const result = await pool.save();
    if (result) {
      res.status(201).json({
        message: "New Pool is create successfully!",
        pool: result,
        requestForm,
      });
    } else {
      res.status(500).json({
        message: "Cannot create pool!",
        pool: result,
        requestForm,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot create pool!",
      error: err.message,
      requestForm,
    });
  }
});
module.exports = router;
