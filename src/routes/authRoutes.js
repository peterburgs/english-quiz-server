const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Import User model
const UserCredential = mongoose.model("UserCredential");

// Init Router
const router = express.Router();

// POST method: Sign Up
router.post("/signup", async (req, res) => {
  const { email, password, role, isActive } = req.body;
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
  console.log("*LOG: Saving User Credential to database");
  await userCredential
    .save()
    .then((result) => {
      console.log("*LOG: ", result);
      res.status(201).json({
        message: "Sign up successfully",
        userCredential,
        token,
      });
      console.log("*LOG: User Credential is added successfully");
    })
    .catch((error) => {
      console.log("*LOG: " + error.message);
      res.status(500).json({
        message: error.message,
      });
    });
});

// GET method: Sign In
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Validate empty input
  if (!email || !password) {
    return res.status(422).json({
      error: "Email or Password is incorrect",
    });
  }

  const userCredential = await UserCredential.findOne({ email });

  // Validate email is existed or not
  if (!userCredential) {
    return res.status(404).json({
      error: "Email not found",
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
      message: "Log in successful",
      token,
    });
  } catch (err) {
    return res.status(422).json({
      error: "Invalid email or password",
    });
  }
});
// Export
module.exports = router;
