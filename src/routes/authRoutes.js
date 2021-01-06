const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Import Models
const UserCredential = mongoose.model("UserCredential");
const User = mongoose.model("User");

// Init Router
const router = express.Router();

// Middlewares
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");

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
    { userCredential: userCredential._id },
    String(process.env.SECRET_KEY),
    {
      // Expiration Time
      expiresIn: "8h",
    }
  );
  try {
    const userCredentialResult = await userCredential.save();
    if (userCredentialResult != null) {
      const user = new User({
        userCredential: userCredential._id,
        fullName: userCredential.role == 1 ? "Admin" : "New Learner",
        avatarUrl: "../assets/defaultAvatar.jpg",
        coin: 0,
        exp: 0,
        hasX2Exp: false,
        hasX5Exp: false,
      });
      const userResult = await user.save();

      if (userResult != null) {
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
      error,
      requestForm,
    });
  }
});

// POST method: Sign In as learner
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
  // Validate user
  if (userCredential.isActive === false) {
    return res.status(403).json({
      error: "The account is disabled",
      requestForm,
    });
  }
  // Compare registered email and providing email
  try {
    const signinResult = await userCredential.comparePassword(
      password
    );
    const token = jwt.sign(
      { userCredential: userCredential._id },
      String(process.env.SECRET_KEY),
      {
        // Expiration Time
        expiresIn: "8h",
      }
    );
    res.status(200).json({
      userCredential,
      message: "Success",
      token,
      expiresIn: 8,
      requestForm,
    });
  } catch (err) {
    console.log("[authRoutes.js] *err: ", err);
    return res.status(422).json({
      error: "Invalid email or password",
      requestForm,
    });
  }
});

// POST method: Sign In as ADMIN
router.post("/signin/admin", async (req, res) => {
  const { email, password } = req.body;
  const requestForm = {
    method: "POST",
    url: "/signin/admin",
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
  if (!userCredential || userCredential.role === 2) {
    return res.status(404).json({
      error: "Email not found",
      requestForm,
    });
  }
  // Compare registered email and providing email
  try {
    await userCredential.comparePassword(password);

    const token = jwt.sign(
      { userCredential: userCredential._id },
      String(process.env.SECRET_KEY),
      {
        // Expiration Time
        expiresIn: "8h",
      }
    );
    res.status(200).json({
      userCredential,
      message: "Success",
      token,
      expiresIn: 8,
      requestForm,
    });
  } catch (err) {
    console.log("[authRoutes.js] *err: ", err);
    return res.status(422).json({
      error: "Invalid email or password",
      requestForm,
    });
  }
});

// POST Method: reset password
router.post("/reset", requireAuth, async (req, res) => {
  const email = req.userCredential.email;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const userCredential = await UserCredential.findOne({ email });

  // Validate email is existed or not
  if (!userCredential) {
    return res.status(404).json({
      error: "Email not found",
    });
  }
  // Validate user
  if (userCredential.isActive === false) {
    return res.status(403).json({
      error: "The account is disabled",
    });
  }

  // Compare registered email and providing email
  try {
    const signinResult = await userCredential.comparePassword(
      currentPassword
    );
    console.log("Password matched!");
    userCredential.password = newPassword;
    await userCredential.save();
    res.status(200).json({
      message: "Password reseted!",
      userCredential,
    });
  } catch (err) {
    console.log("[authRoutes.js] *err: ", err);
    return res.status(401).json({
      error: "Password mismatched!",
    });
  }
});
// Export
module.exports = router;
