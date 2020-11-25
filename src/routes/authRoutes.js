const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//const UserCredential = mongoose.model("UserCredential");
// Router
const router = express.Router();

router.post("/signup", (req, res) => {
  res.status(200).json({
    message: "You are in signup route",
  });
});

module.exports = router;
