const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Import Models
const UserCredential = mongoose.model("UserCredential");
const User = mongoose.model("User");

// Init Router
const router = express.Router();

// POST method: Sign Up
router.post("/signup", async (req, res) => {
  const { email, password, role, isActive } = req.body;
  const requestForm = {
    method: "POST",
    url: "/sigup",
    email: { type: "String", required: true },
    password: { type: "String", required: true },
    role: {
      type: Number,
      // 1: Admin
      // 2: Learner
      required: false,
      default: 2,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  };
  const userCredential = new UserCredential({
    email,
    password,
    role,
    isActive,
  });
  const token = jwt.sign(
    { userCredentialId: userCredential._id },
    String(process.env.SECRET_KEY),
    {
      // Expiration Time
      expiresIn: "1h",
    }
  );
  try {
    const userCredentialResult = await userCredential.save();
    if (userCredentialResult != null) {
      const user = new User({
        userCredential: userCredential._id,
        fullName: "New Learner",
        avatarUrl: "../assets/defaultAvatar.jpg",
        coin: 0,
        currentLevel: 1,
        dailyGoal: 0,
        exp: 0,
        isTurnOnNotification: true,
        isTurnOnRemindingViaEmail: true,
        streak: 0,
      });
      const userResult = await user.save();

      if (user != null) {
        console.log("Create User successfully!");
        res.status(201).json({
          message: "Success",
          user: userResult,
          userCredential,
          token,
          requestForm,
        });
      }
    } else {
      res.status(500).json({ message: "Fail" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Fail",
      requestForm,
    });
  }
});

// POST method: Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const requestForm = {
    method: "POST",
    url: "/signin",
    email: { type: "String", required: true },
    password: { type: "String", required: true },
  };
  // Validate empty input
  if (!email || !password) {
    return res.status(422).json({
      error: "Email or Password is incorrect",
      requestForm,
    });
  }

  const userCredential = await UserCredential.findOne({ email });

  // Validate email is existed or not
  if (!userCredential) {
    return res.status(404).json({
      error: "Email not found",
      requestForm,
    });
  }

  // Compare registered email and providing email
  try {
    await userCredential.comparePassword(password);

    const token = jwt.sign(
      { userCredentialId: userCredential._id },
      String(process.env.SECRET_KEY)
    );
    res.status(200).json({
      message: "Success",
      token,
      requestForm,
    });
  } catch (err) {
    return res.status(422).json({
      error: "Invalid email or password",
      requestForm,
    });
  }
});
// Export
module.exports = router;
