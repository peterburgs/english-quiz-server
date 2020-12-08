// Get userCredential model (without re-create new model)
require("./models/UserCredential");
require("./models/User");
require("./models/Level");
//
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Middlewares
const requireAuth = require("./middlewares/requireAuth");

// MongoDB Connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const levelRoutes = require("./routes/levelRoutes");

//Define app
const app = express();

// Test connection status
mongoose.connection.on("connected", () => {
  console.log("*LOG: Connected to MongoDB successfully!");
});
mongoose.connection.on("error", () => {
  console.log("*LOG: Fail to connect to MongoDB!");
});

// Body Parser
app.use(bodyParser.json());

// Use Routers
app.use(authRoutes);
app.use("/users", userRoutes);
app.use("/levels", levelRoutes);
// GET
app.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.email}`,
  });
});
module.exports = app;
