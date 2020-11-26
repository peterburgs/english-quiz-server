// Get userCredential model (without re-create new model)
require("./models/UserCredential");

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

// User Routers
app.use(authRoutes);

// GET
app.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Welcome ${req.user.email}`,
  });
});
module.exports = app;
