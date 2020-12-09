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
  console.log("[authRoutes.js : 14] *req.body: ", req.body)
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
  console.log("[authRoutes.js : 39] *userCredential: ", userCredential)
  const token = jwt.sign(
    { userCredentialId: userCredential._id },
    String(process.env.SECRET_KEY),
    {
      // Expiration Time
      expiresIn: "1h",
    }
  );
  console.log("[authRoutes.js : 48] *token: ", token)
  try {
    const userCredentialResult = await userCredential.save();
    console.log("[authRoutes.js : 51] *userCredentialResult: ", userCredentialResult)
    if (userCredentialResult != null) {
      const user = new User({
        userCredential: userCredential._id,
        fullName: userCredential.role == 1 ? "Admin" : "New Learner",
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
      console.log("[authRoutes.js : 66] *userResult: ", userResult)

      if (userResult != null) {
        console.log("[authRoutes.js : 69] Create User successfully!");
        res.status(201).json({
          message: "Success",
          user: userResult,
          userCredential,
          token,
          requestForm,
        });
      }
    } else {
      console.log("[authRoutes.js : 79] Error")
      res.status(500).json({ message: "Fail" });
    }
  } catch (error) {
    console.log("[authRoutes.js : 83] ", error)
    res.status(500).json({
      message: "Fail",
      error,
      requestForm,
    });
  }
});

// POST method: Sign In
router.post("/signin", async (req, res) => {
  console.log("[authRoutes.js : 94] *request.body: ", req.body)
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
  console.log("[authRoutes.js : 111] *userCredential: ", userCredential)

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
    console.log("[authRoutes.js : 129] *still sign in... ")
    res.status(200).json({
      message: "Success",
      token,
      requestForm,
    });
    console.log("[authRoutes.js : 135] *signed in ")
  } catch (err) {
    console.log("[authRoutes.js : 137] *err: ", err)

    return res.status(422).json({
      error: "Invalid email or password",
      requestForm,
    });
  }
});
// Export
module.exports = router;
