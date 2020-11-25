const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema
const userCredentialSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  isActive: {
    type: String,
    require: true,
  },
});

// Process model before saving
userCredentialSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Compare correct password with candidatePassword
userCredentialSchema.methods.comparePassword = function (
  candidatePassword
) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      candidatePassword,
      user.password,
      (err, isMatch) => {
        if (err) {
          return reject(err);
        }
        if (!isMatch) {
          return reject(false);
        }
        resolve(true);
      }
    );
  });
};
mongoose.model("UserCredential", userCredentialSchema);
