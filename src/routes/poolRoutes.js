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
    const pools = await Pool.find({ isRemoved: false });
    // If pools are found
    if (pools.length != 0) {
      res.status(200).json({
        message: "Found!",
        pools,
        requestForm,
      });
    } else {
      res.status(200).json({
        message: "No document found!",
        pools: [],
        requestForm,
      });
    }
  } catch (err) {
    console.log("[poolRoutes.js] *err: ", err);
    res.status(404).json({
      message: "No document found!",
      error: err.message,
      requestForm,
    });
  }
});

//GET Method: get a specific pool
router.get("/:poolId", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/pools/:poolId",
  };
  try {
    const id = req.params.poolId;
    const pool = await Pool.findOne({ _id: id }).populate(
      "questions"
    );
    if (pool) {
      res.status(200).json({
        message: "Found!",
        pool: pool,
        requestForm,
      });
    } else {
      res.status(404).json({
        message: "No document found!",
        pool: pool,
        requestForm,
      });
    }
  } catch (err) {
    console.log("[poolRoutes.js] *err: ", err);
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

// PUT Method: Edit a Pool
router.put("/:poolId", async (req, res) => {
  const requestForm = {
    method: "PUT",
    url: "/pools/",
    name: {
      type: "String",
      default: "New pool",
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  };

  const id = req.params.poolId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await Pool.findByIdAndUpdate(
      { _id: id },
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(201).json({ pool: result, requestForm });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot edit",
      err: err.message,
      requestForm,
    });
  }
});

// Delete Method: Delete an existing pool
router.delete("/:poolId", async (req, res) => {
  const id = req.params.poolId;
  try {
    const result = await Pool.findByIdAndUpdate(
      { _id: id },
      { $set: { isRemoved: true } }
    ).exec();
    if (result) {
      res.status(201).json({ pool: result });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot delete",
      err: err.message,
    });
  }
});
module.exports = router;
