const express = require("express");
const mongoose = require("mongoose");
// Import Models
const User = mongoose.model("User");
const UserCredential = mongoose.model("UserCredential");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

// User must be authenticated before accessing
router.use(requireAuth);

// GET Method: get a userCredential by Id
// router.get("/:userCredentialId", async (req, res) => {
//   const requestForm = {
//     method: "GET",
//     url: "/users/:userCredentialId",
//   };
//   try {
//     const id = req.params.userCredentialId;
//     const user = await User.find({ userCredential: id }).populate("progresses");
//     const progress = user.progresses;
//     if (user.length) {
//       res.status(200).json({
//         message: "Success!",
//         user,
//         progresses,
//         requestForm,
//       });
//     } else {
//       console.log("[userRoutes.js] User not found");
//       res.status(404).json({
//         message: "User not found",
//         requestForm,
//       });
//     }
//   } catch (err) {
//     console.log("[userRoutes.js] *err: ", err);

//     res.status(500).json({
//       message: "User not found",
//       requestForm,
//     });
//   }
// });

// GET Method: Get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().populate("userCredential").exec();
    if (users) {
      res.status(200).json({
        users,
        message: "All users found",
      });
    } else {
      res.status(200).json({
        users,
        message: "Cannot find any user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// PUT Method: disable user
router.put("/:userId/disable", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (user) {
      const userCredential = await UserCredential.findOne({
        _id: user.userCredential._id,
      }).exec();

      userCredential.isActive = false;

      await userCredential.save();

      res.status(200).json({
        message: "Disable user successfully",
      });
    } else {
      res.status(404).json({
        message: "Cannot find user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// PUT Method: enable user
router.put("/:userId/enable", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    const user = await User.findOne({ _id: userId }).exec();
    if (user) {
      const userCredential = await UserCredential.findOne({
        _id: user.userCredential._id,
      }).exec();

      userCredential.isActive = true;

      await userCredential.save();

      res.status(200).json({
        message: "Enable user successfully",
      });
    } else {
      res.status(404).json({
        message: "Cannot find user",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// GET Method: get a user by Id
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({
      userCredential: req.userCredential,
    })
      .populate("progresses")
      .exec();
    if (user) {
      res.status(200).json({
        message: "Found",
        user: user,
        progresses: user.progresses,
      });
    } else {
      res.status(404).json({
        message: "User not Found",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Failed",
      error: err.message,
    });
  }
});
module.exports = router;
