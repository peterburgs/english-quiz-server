const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Import model
const UserCredential = mongoose.model("UserCredential");

// Export module
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    console.log("[requireAuth.js] un");
    return res.status(401).json({
      message:
        "You are not authenticated! Please sign in to continue.",
    });
  }
  const rawToken = authorization.split(" ");
  const token = rawToken[1];
  jwt.verify(
    token,
    String(process.env.SECRET_KEY),
    async (error, payload) => {
      if (error) {
        return res.status(401).json({
          message: "[requireAuth.js] *error: " + error,
        });
      }
      const { userCredential } = payload;
      try {
        const userCredentialResult = await UserCredential.findById(
          userCredential
        );
        req.userCredential = userCredentialResult;
        next();
      } catch (err) {
        console.log(err);
      }
    }
  );
};
