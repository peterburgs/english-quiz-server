const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Import model
const UserCredential = mongoose.model("UserCredential");

// Export module
module.exports = (req, res, next) => {
  // Role: 1 =Admin, 2=learner
  const email = req.headers.email;

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      message: "You are not authenticated! Please sign in to continue.",
    });
  }
  const rawToken = authorization.split(" ");
  const token = rawToken[1];

  jwt.verify(token, String(process.env.SECRET_KEY), async (error, payload) => {
    if (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
    const { userCredential } = payload;
    try {
      const userCredentialResult = await UserCredential.findOne({
        email: email,
      });
      if (userCredentialResult.role === 1) {
        req.userCredential = userCredentialResult;
        next();
      } else {
        res.status(403).json({
          message: "Admin privileged",
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
};
