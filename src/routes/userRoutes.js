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
  console.log("[userRoutes.js : 13] *req.body: ", req.body)

  const requestForm = {
    method: "GET",
    url: "/users/",
    userCredentialId: {
      type: mongoose.Types.ObjectId,
      ref: "UserCredential",
    },
  };
  try {
    const user = await User.findOne({
      userCredentialId: req.body.userCredentialId,
    }).populate("progress");
    console.log("[userRoutes.js : 27] *user: ", user)

    if (user) {
      console.log("[userRoutes.js : 30] *user: ", user)
      res.status(200).json({
        message: "Success!",
        user,
        requestForm,
      });
    } else {
      console.log("[userRoutes.js : 37] User not found");
      res.status(404).json({
        message: "User not found",
        requestForm,
      });
    }
  } catch (err) {
    console.log("[userRoutes.js : 44] *err: ", err)

    res.status(500).json({
      message: "User not found",
      requestForm,
    });
  }
});

module.exports = router;
