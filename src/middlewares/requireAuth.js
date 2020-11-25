const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Import model
const UserCredential = mongoose.model("UserCredential");

// Export module
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message:
        "You are not authenticated! Please sign in to continue.",
    });
  }
  const rawToken = authorization.split(" ");
  const token = rawToken[1];
  console.log(token);
  jwt.verify(token, "SECRET_KEY", async (error, payload) => {
    if (error) {
      console.log(error.message);
      return res.status(401).json({
        message: error.message,
      });
    }
    const { userId } = payload;
    const userCredential = await UserCredential.findById(userId);
    req.user = userCredential;
    next();
  });
};
