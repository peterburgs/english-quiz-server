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
  console.log("[userRoutes.js] *req.body: ", req.body)

  const requestForm = {
    method: "GET",
    url: "/users/",
    userCredential: {
      type: mongoose.Types.ObjectId,
      ref: "UserCredential",
    },
  };
  try {
    const user = await User.findOne({
      userCredential: req.userCredential,
    }).populate("progress");
    console.log("[userRoutes.js] *user: ", user)

    if (user) {
      console.log("[userRoutes.js] *user: ", user)
      res.status(200).json({
        message: "Success!",
        user,
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
    console.log("[userRoutes.js] *err: ", err)

    res.status(500).json({
      message: "User not found",
      requestForm,
    });
  }
});

module.exports = router;
