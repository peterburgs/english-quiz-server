const express = require("express");
const mongoose = require("mongoose");
// Import Models
const User = mongoose.model("User");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

// User must be authenticated before accessing
router.use(requireAuth);

// GET Method: get a user
router.get("/:userCredentialId", async (req, res) => {
  const requestForm = {
    method: "GET",
    url: "/users/",
  };
  try {
    const id = req.params.userCredentialId;
    const user = await User.find({ userCredential: id }).populate(
      "progress"
    );
    const progress = user.progress;
    if (user.length) {
      res.status(200).json({
        message: "Success!",
        user,
        progress,
        requestForm,
      });
    } else {
      console.log("[userRoutes.js] User not found");
      res.status(404).json({
        message: "User not found",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[userRoutes.js] *err: ", err);

    res.status(500).json({
      message: "User not found",
      requestForm,
    });
  }
});

module.exports = router;
