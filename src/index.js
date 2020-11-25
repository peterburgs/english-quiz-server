const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import Models
require("./models/UserCredential");

// Import Middlewares
const requireAuth = require("./middlewares/requireAuth");

// Import Routes
const authRoutes = require("./routes/authRoutes");

//Define app
const app = express();

// MongoDB Connection
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

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

module.exports = app;
