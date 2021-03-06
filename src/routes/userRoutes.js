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
    }).exec();
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

// PUT Method: update user by Id
router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updateOps = {};
  for (const [key, val] of Object.entries(req.body)) {
    updateOps[key] = val;
  }
  try {
    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(200).json({
        message: "Updated",
        user: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot edit",
      err: err.message,
    });
  }
});

// PUT Method: update user by Id
router.put("/:userId/purchase", async (req, res) => {
  const userId = req.params.userId;
  const item = req.body.item;
  console.log(item);
  try {
    if (item) {
      const user = await User.findOne({ _id: userId });
      const result = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: {
            hasX2Exp: item === "x2" || user.hasX2Exp,
            hasX5Exp: item === "x5" || user.hasX5Exp,
            coin:
              user.coin -
              (item === "x2" ? 30 : item === "x5" ? 50 : 0),
          },
        },
        { new: true }
      ).exec();
      if (result) {
        const purchasedItem = item;
        setTimeout(
          () => {
            console.log("hello");
            if (purchasedItem === "x2") {
              (async () => {
                await User.findByIdAndUpdate(
                  { _id: userId },
                  {
                    $set: {
                      hasX2Exp: false,
                    },
                  },
                  { new: true }
                ).exec();
              })();
            }
            if (purchasedItem === "x5") {
              (async () => {
                await User.findByIdAndUpdate(
                  { _id: userId },
                  {
                    $set: {
                      hasX5Exp: false,
                    },
                  },
                  { new: true }
                ).exec();
              })();
            }
          },
          24 * 3600000,
          purchasedItem
        );
        res.status(200).json({
          message: "Updated",
          user: result,
        });
      }
    } else {
      res.status(404).json({
        message: "Missing field",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Cannot purchase",
      err: err.message,
    });
  }
});

module.exports = router;
