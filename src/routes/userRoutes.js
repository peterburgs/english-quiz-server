const express = require("express");
const mongoose = require("mongoose");
// Import Models
const User = mongoose.model("User");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

// User must be authenticated before accessing
router.use(requireAuth);

// GET Method: get a user
router.get("/", async (req, res) => {
  const user = await User.findOne({
    userCredentialId: req.userCredential._id,
  }).populate("progress");
  if (user) {
    console.log(user);
    res.status(200).json({
      message: "Found!",
      user,
    });
  } else {
    console.log("User not found");
    res.status(404).json({
      message: "User not found",
    });
  }
});

module.exports = router;
